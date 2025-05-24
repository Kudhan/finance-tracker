import pool from "../libs/database.js";

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

export const createAccount = async (req, res) => {
    const client = await pool.connect();
    try {
        const { userId } = req.user;
        const { name, amount, account_number } = req.body;

        // Input validation
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

        await client.query('BEGIN');

        const createAccountResult = await client.query({
            text: "INSERT INTO tblaccount (user_id, account_name, account_number, account_balance) VALUES ($1, $2, $3, $4) RETURNING *",
            values: [userId, name, account_number, amount],
        });

        const account = createAccountResult.rows[0];

        const userAccounts = [name];

        await client.query({
            text: "UPDATE tbluser SET accounts = array_cat(accounts, $1), updatedAt = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
            values: [userAccounts, userId],
        });

        const description = `${account.account_name} (Initial Deposit)`;

        const initialDeposit = await client.query({
            text: "INSERT INTO tbltransaction (user_id, description, type, status, amount, source) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            values: [
                userId,
                description,
                "income",
                "completed",
                amount,
                account.account_number,
            ],
        });

        await client.query('COMMIT');

        res.status(201).json({
            status: "success",
            message: "Account created successfully",
            data: account,
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error creating account:", err);
        res.status(500).json({ status: "failed", message: err.message });
    } finally {
        client.release();
    }
};

export const addMoneyToAccount = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const { amount } = req.body;
        const newAmount = Number(amount);

        if (isNaN(newAmount) || newAmount <= 0) {
            return res.status(400).json({ status: "failed", message: "Invalid amount" });
        }

        const result = await pool.query({
            text: "UPDATE tblaccount SET account_balance = (account_balance + $1), updatedAt = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
            values: [newAmount, id],
        });

        if (result.rowCount === 0) {
            return res.status(404).json({ status: "failed", message: "Account not found" });
        }

        const accountInformation = result.rows[0];
        const description = `${accountInformation.account_name} (Deposit)`;

        await pool.query({
            text: "INSERT INTO tbltransaction (user_id, description, type, status, amount, source) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            values: [
                userId,
                description,
                "income",
                "completed",
                newAmount,
                accountInformation.account_number,
            ],
        });

        res.status(200).json({
            status: "success",
            message: "Money added successfully",
            data: accountInformation,
        });

    } catch (err) {
        console.error("Error adding money to account:", err);
        res.status(500).json({ status: "failed", message: err.message });
    }
};
