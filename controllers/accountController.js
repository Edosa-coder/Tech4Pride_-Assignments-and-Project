const pool = require("../db");

const generateAccountNumber = async () => {
    while (true) {
        const accountNumber = Math.floor(
            1000000000 + Math.random() * 9000000000
        ).toString();

        const [existingAccount] = await pool.query(
            `SELECT id
             FROM accounts
             WHERE account_number = ?`,
            [accountNumber]
        );

        if (existingAccount.length === 0) {
            return accountNumber;
        }
    }
};

const createAccount = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { account_type, currency } = req.body;

        // Check for user's active account count
        const [accounts] = await pool.query(
            `SELECT COUNT(*) AS account_count
             FROM accounts
             WHERE user_id = ?
             AND is_active = 1`,
            [userId]
        );

        if (accounts[0].account_count >= 3) {
            return res.status(400).json({
                error: "A user can have at most 3 active accounts."
            });
        }

        const accountNumber = await generateAccountNumber();

        // Create the new account
        const [result] = await pool.query(
            `INSERT INTO accounts
                (user_id, account_number, account_type, balance, currency)
             VALUES (?, ?, ?, 0.00, ?)`,
            [
                userId,
                accountNumber,
                account_type,
                currency
            ]
        );

        return res.status(201).json({
            message: "Account created successfully.",
            account: {
                id: result.insertId,
                user_id: userId,
                account_number: accountNumber,
                account_type: account_type,
                balance: "0.00",
                currency: currency,
                is_active: 1
            }
        });

    } catch (error) {
        console.error("Error creating account:", error);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
};

const getAccounts = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [accounts] = await pool.query(
            `SELECT 
                accounts.id,
                accounts.account_number,
                accounts.account_type,
                accounts.balance,
                accounts.currency,
                accounts.is_active,
                accounts.created_at,
                users.full_name,
                users.email
             FROM accounts
             INNER JOIN users 
                ON accounts.user_id = users.id
             WHERE accounts.user_id = ?
             ORDER BY accounts.created_at DESC`,
            [userId]
        );
            

        return res.status(200).json({
            accounts: accounts
        });

    } catch (error) {
        console.error("Get accounts error:", error);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
};
const getAccountDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { account_number } = req.params;

        const [accounts] = await pool.query(
            `SELECT
                a.id,
                a.account_number,
                a.account_type,
                a.balance,
                a.currency,
                a.is_active,
                a.created_at,
                (
                    SELECT u.full_name
                    FROM users u
                    WHERE u.id = a.user_id
                ) AS owner_name
             FROM accounts a
             WHERE a.account_number = ?
             AND a.user_id = ?`,
            [account_number, userId]
        );

        if (accounts.length === 0) {
            return res.status(404).json({
                error: "Account not found."
            });
        }

        return res.status(200).json({
            account: accounts[0]
        });

    } catch (error) {
        console.error("Get account details error:", error);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
};

module.exports = {
    createAccount,
    getAccounts,
    getAccountDetails
};
