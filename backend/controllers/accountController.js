import pool from "../libs/database.js";

// Get all accounts for the user
export const getAccount = async (req, res) => {
  try {
    const { userId } = req.user;

    const accounts = await pool.query({
      text: "SELECT * FROM tblaccount WHERE user_id = $1",
      values: [userId],
    });

    if (accounts.rowCount === 0) {
      return res.status(404).json({ status: "failed", message: "Account not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Account fetched successfully",
      accounts: accounts.rows,
    });
  } catch (err) {
    console.error("Error fetching account:", err);
    res.status(500).json({ status: "failed", message: err.message });
  }
};

// Create a new account
export const createAccount = async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId } = req.user;
    const { name, amount, account_number } = req.body;

    if (!name || typeof name !== "string" || !account_number || isNaN(amount)) {
      return res.status(400).json({ status: "failed", message: "Invalid input data" });
    }

    const accountExists = await client.query({
      text: "SELECT * FROM tblaccount WHERE account_name = $1 AND user_id = $2",
      values: [name, userId],
    });

    if (accountExists.rows.length > 0) {
      return res.status(400).json({ status: "failed", message: "Account already exists" });
    }

    await client.query("BEGIN");

    const createAccountResult = await client.query({
      text: "INSERT INTO tblaccount (user_id, account_name, account_number, account_balance) VALUES ($1, $2, $3, $4) RETURNING *",
      values: [userId, name, account_number, amount],
    });

    const account = createAccountResult.rows[0];

    await client.query({
      text: "UPDATE tbluser SET accounts = array_cat(accounts, $1), updatedAt = CURRENT_TIMESTAMP WHERE id = $2",
      values: [[name], userId],
    });

    const description = `${account.account_name} (Initial Deposit)`;

    await client.query({
      text: "INSERT INTO tbltransaction (user_id, description, type, status, amount, source, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      values: [
        userId,
        description,
        "income",
        "success", // fixed from "completed"
        amount,
        account.account_number,
        account.id,
      ],
    });

    await client.query("COMMIT");

    res.status(201).json({
      status: "success",
      message: "Account created successfully",
      data: account,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating account:", err);
    res.status(500).json({ status: "failed", message: err.message });
  } finally {
    client.release();
  }
};

// Add money to an existing account
export const addMoneyToAccount = async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId } = req.user;
    const { id } = req.params; // account ID
    const { amount } = req.body;
    const newAmount = Number(amount);

    if (!newAmount || newAmount <= 0) {
      return res.status(400).json({ status: "failed", message: "Invalid amount" });
    }

    await client.query("BEGIN");

    // 1. Fetch the account
    const accountResult = await client.query({
      text: "SELECT * FROM tblaccount WHERE id = $1 AND user_id = $2",
      values: [id, userId],
    });

    if (accountResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ status: "failed", message: "Account not found" });
    }

    const account = accountResult.rows[0];

    // 2. Update account balance
    const updatedAccountResult = await client.query({
      text: `UPDATE tblaccount 
             SET account_balance = account_balance + $1, updatedAt = CURRENT_TIMESTAMP 
             WHERE id = $2 
             RETURNING *`,
      values: [newAmount, id],
    });

    // 3. Insert transaction with valid account_id
    const description = `${account.account_name} (Deposit)`;

    await client.query({
      text: `INSERT INTO tbltransaction 
             (user_id, description, type, status, amount, source, account_id) 
             VALUES ($1, $2, 'income', 'completed', $3, $4, $5)`,
      values: [userId, description, newAmount, account.account_number, account.id],
    });

    await client.query("COMMIT");

    res.status(200).json({
      status: "success",
      message: "Money added successfully",
      data: updatedAccountResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Add money error:", error);
    res.status(500).json({ status: "failed", message: error.message });
  } finally {
    client.release();
  }
};
