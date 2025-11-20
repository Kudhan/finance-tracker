import pool from "../libs/database.js";
import { getMonthName } from "../libs/index.js";

// Fetch transactions within a date range and optional search
export const getTransactions = async (req, res) => {
  try {
    const today = new Date();
    const _sevenDaysAgo = new Date(today);
    _sevenDaysAgo.setDate(today.getDate() - 7);

    const sevenDaysAgo = _sevenDaysAgo.toISOString();
    const { df, dt, s } = req.query;
    const { userId } = req.user;

    const startDate = new Date(df || sevenDaysAgo).toISOString();
    const endDate = new Date(dt || today).toISOString();
    const search = s || "";

    const transactions = await pool.query({
      text: `SELECT * FROM tbltransaction 
             WHERE user_id = $1 
               AND createdat BETWEEN $2 AND $3 
               AND (description ILIKE '%' || $4 || '%' OR status ILIKE '%' || $4 || '%' OR source ILIKE '%' || $4 || '%') 
             ORDER BY id DESC`,
      values: [userId, startDate, endDate, search],
    });

    res.status(200).json({
      status: "success",
      data: transactions.rows,
      message: "Transactions fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get dashboard info including totals and monthly chart
export const getDashboardInformation = async (req, res) => {
  try {
    const { userId } = req.user;
    let totalIncome = 0;
    let totalExpense = 0;

    // Fetch total income & expense (only transactions linked to accounts)
    const transactionsResult = await pool.query({
      text: `SELECT type, COALESCE(SUM(amount),0) as totalamount 
             FROM tbltransaction 
             WHERE user_id = $1 AND account_id IS NOT NULL 
             GROUP BY type`,
      values: [userId],
    });

    const transactions = transactionsResult.rows;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += Number(transaction.totalamount);
      } else if (transaction.type === "expense") {
        totalExpense += Number(transaction.totalamount);
      }
    });

    const availableBalance = totalIncome - totalExpense;

    // Chart data by month (current year)
    const year = new Date().getFullYear();
    const start_Date = new Date(year, 0, 1).toISOString();
    const end_Date = new Date(year, 11, 31, 23, 59, 59).toISOString();

    const result = await pool.query({
      text: `SELECT EXTRACT(MONTH FROM createdat) AS month, type, COALESCE(SUM(amount),0) AS totalamount 
             FROM tbltransaction 
             WHERE user_id = $1 AND createdat BETWEEN $2 AND $3 AND account_id IS NOT NULL
             GROUP BY EXTRACT(MONTH FROM createdat), type`,
      values: [userId, start_Date, end_Date],
    });

    const data = new Array(12).fill().map((_, index) => {
      const monthData = result.rows.filter(
        (item) => parseInt(item.month) === index + 1
      );
      const Income =
        monthData.find((item) => item.type === "income")?.totalamount || 0;
      const Expense =
        monthData.find((item) => item.type === "expense")?.totalamount || 0;

      return {
        label: getMonthName(index),
        Income: Number(Income),
        Expense: Number(Expense),
      };
    });

    // Last 5 transactions (recent)
    const lastTransactionResult = await pool.query({
      text: `SELECT * FROM tbltransaction WHERE user_id = $1 ORDER BY id DESC LIMIT 5`,
      values: [userId],
    });

    // Last 4 accounts (recent)
    const lastAccountResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE user_id = $1 ORDER BY id DESC LIMIT 4`,
      values: [userId],
    });

    // Per-account totals for the user
    const dashboardSql = `
      SELECT a.id AS account_id,
             a.account_name,
             COALESCE(SUM(t.amount),0) AS total_amount,
             COUNT(t.id) AS tx_count
      FROM tblaccount a
      LEFT JOIN tbltransaction t ON t.account_id = a.id
      WHERE a.user_id = $1
      GROUP BY a.id, a.account_name
      ORDER BY a.id;
    `;
    const { rows: accountTotals } = await pool.query(dashboardSql, [userId]);

    res.status(200).json({
      status: "success",
      availableBalance,
      totalIncome,
      totalExpense,
      ChartData: data,
      lastTransactions: lastTransactionResult.rows,
      lastAccounts: lastAccountResult.rows,
      accountTotals,
      message: "Dashboard information fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching dashboard info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a debit transaction with proper transaction handling
export const addTransaction = async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId } = req.user;
    // accept account_id from params or body for flexibility
    const account_id = req.params.account_id || req.body.account_id || req.body.accountId;
    const { description, source, amount } = req.body;

    if (!description || !source || !amount || !account_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAmount = Number(amount);
    if (newAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    const result = await client.query({
      text: `SELECT * FROM tblaccount WHERE id = $1`,
      values: [account_id],
    });

    const accountInfo = result.rows[0];
    if (!accountInfo) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (accountInfo.account_balance < newAmount) {
      return res.status(400).json({ message: "Insufficient account balance" });
    }

    await client.query("BEGIN");

    await client.query({
      text: `UPDATE tblaccount SET account_balance = account_balance - $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [newAmount, account_id],
    });

    await client.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source, account_id, createdat, updatedat) 
             VALUES($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      values: [userId, description, "expense", "success", newAmount, source, account_id],
    });

    await client.query("COMMIT");

    res.status(201).json({
      status: "success",
      message: "Transaction added successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
};

// Transfer money between accounts with transaction handling
export const transferMoneyToAccount = async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId } = req.user;
    const { from_account, to_account, amount } = req.body;

    if (!from_account || !to_account || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAmount = Number(amount);
    if (newAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    const fromAccountResult = await client.query({
      text: `SELECT * FROM tblaccount WHERE id = $1 AND user_id = $2`,
      values: [from_account, userId],
    });

    const fromAccountInfo = fromAccountResult.rows[0];
    if (!fromAccountInfo) {
      return res.status(404).json({ message: "From account not found" });
    }

    if (newAmount > fromAccountInfo.account_balance) {
      return res.status(400).json({ message: "Insufficient balance in the from account" });
    }

    const toAccountResult = await client.query({
      text: `SELECT * FROM tblaccount WHERE id = $1 AND user_id = $2`,
      values: [to_account, userId],
    });

    if (toAccountResult.rowCount === 0) {
      return res.status(404).json({ message: "To account not found" });
    }

    const toAccount = toAccountResult.rows[0];

    await client.query("BEGIN");

    // Deduct from source account
    await client.query({
      text: `UPDATE tblaccount SET account_balance = account_balance - $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [newAmount, from_account],
    });

    // Add to destination account
    await client.query({
      text: `UPDATE tblaccount SET account_balance = account_balance + $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [newAmount, to_account],
    });

    const description = `Transfer from ${fromAccountInfo.account_name} to ${toAccount.account_name}`;
    const description1 = `Received from ${fromAccountInfo.account_name} to ${toAccount.account_name}`;

    // Insert transaction for debit side
    await client.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source, account_id, createdat, updatedat)
             VALUES ($1, $2, 'transfer', 'success', $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      values: [
        userId,
        description,
        newAmount,
        fromAccountInfo.account_name,
        from_account,
      ],
    });

    // Insert transaction for credit side
    await client.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source, account_id, createdat, updatedat)
             VALUES ($1, $2, 'transfer', 'success', $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      values: [
        userId,
        description1,
        newAmount,
        toAccount.account_name,
        to_account,
      ],
    });

    await client.query("COMMIT");

    res.status(201).json({
      status: "success",
      message: "Money transferred successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error transferring money:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
};
