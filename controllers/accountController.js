const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

// generation of account numbers
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
//Creating new accounts

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

//Getting registered accounts

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

//Getting Account details
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

//Account history
const getAccountHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { account_number } = req.params;

        // Confirm that this account belongs to the logged-in user
        const [accounts] = await pool.query(
            `SELECT id
             FROM accounts
             WHERE account_number = ?
             AND user_id = ?`,
            [account_number, userId]
        );

        if (accounts.length === 0) {
            return res.status(404).json({
                error: "Account not found."
            });
        }

        const accountId = accounts[0].id;

        // Retrieve transactions involving this account
        const [transactions] = await pool.query(
            `SELECT
                t.id,
                t.reference,
                t.type,
                t.amount,
                t.description,
                t.status,
                t.created_at,
                from_account.account_number AS from_account_number,
                from_user.full_name AS from_account_owner,
                to_account.account_number AS to_account_number,
                to_user.full_name AS to_account_owner
             FROM transactions t
             LEFT JOIN accounts from_account
                ON t.from_account_id = from_account.id
             LEFT JOIN users from_user
                ON from_account.user_id = from_user.id
             LEFT JOIN accounts to_account
                ON t.to_account_id = to_account.id
             LEFT JOIN users to_user
                ON to_account.user_id = to_user.id
             WHERE t.from_account_id = ?
                OR t.to_account_id = ?
             ORDER BY t.created_at DESC`,
            [accountId, accountId]
        );

        return res.status(200).json({
            account_number,
            transactions
        });

    } catch (error) {
        console.error("Get account history error:", error);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
};
//Account summary
const getAccountSummary = async (req, res) => {
    try{
        const userId = req.user.userId;

const [summary] = await pool.query(
    `SELECT
        COUNT(*) AS total_accounts,
        COALESCE(SUM(balance), 0.00) AS total_balance,
        SUM(CASE WHEN account_type = 'savings' THEN 1 ELSE 0 END) AS savings_accounts,
        SUM(CASE WHEN account_type = 'current' THEN 1 ELSE 0 END) AS current_accounts,
        SUM(CASE WHEN account_type = 'fixed' THEN 1 ELSE 0 END) AS fixed_accounts
     FROM accounts
     WHERE user_id = ?
     AND is_active = 1`,
    [userId]
);
        const [transactionSummary] = await pool.query(
            `SELECT 
                 COALESCE(SUM(CASE
                    WHEN t.type ='deposit' THEN t.amount
                    ELSE 0
                END), 0.00) AS total_deposits,
                COALESCE(SUM(CASE
                   WHEN t.type = 'withdrawal' THEN t.amount
                   ELSE 0
                END), 0.00) AS total_withdrawals,
                COALESCE(SUM(CASE
                   WHEN t.type = 'transfer' THEN t.amount
                   ELSE 0
                END), 0.00) AS total_transfers
                 FROM transactions t
             LEFT JOIN accounts source_account
                ON t.from_account_id = source_account.id
             LEFT JOIN accounts destination_account
                ON t.to_account_id = destination_account.id
             WHERE (
                source_account.user_id = ?
                OR destination_account.user_id = ?
             )
             AND t.status = 'completed'`,
            [userId, userId]
        );

        return res.status(200).json({
            account_summary: summary[0],
            transaction_summary: transactionSummary[0]
        });
    } catch (error) {
        console.error("Get account summary error:", error);
        return res.status(500).json({
            error: "Internal server error."
        });
    }
};
        
const deposit = async (req, res) => {
    let connection;

    try{
        const userId = req.user.userId;
        const { account_number, amount, description } = req.body;

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [accounts] = await connection.query(
            `SELECT id, account_number, balance
            FROM accounts
            WHERE account_number = ?
                AND user_id = ?
                AND is_active = 1
            FOR UPDATE`,
            [account_number, userId]
        );
        if (accounts.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Active account not found."
            });
        }

        const account = accounts [0];
        const reference = `DEP-${uuidv4().replace(/-/g, "").slice(0, 16)}`;

        await connection.query(
            `UPDATE accounts
            SET balance = balance + ?
            WHERE id = ?`,
            [amount, account.id]
        );
         await connection.query(
            `INSERT INTO transactions
                (reference, type, amount, from_account_id,
                 to_account_id, description, status)
             VALUES (?, 'deposit', ?, NULL, ?, ?, 'completed')`,
            [reference, amount, account.id, description || null]
        );

        await connection.commit();

        return res.status(201).json({
            message: "Deposit successful.",
            transaction: {
                reference,
                type: "deposit",
                amount: Number(amount).toFixed(2),
                account_number,
                status: "completed"
            }
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error("Deposit error:", error);

        return res.status(500).json({
            message: "Internal server error."
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};


const withdraw = async (req, res) => {
    let connection;
    let transactionStarted = false;

    try {
        const userId = req.user.userId;
        const { account_number, amount, description } = req.body;

        // Get a real database connection.
        connection = await pool.getConnection();

        // Confirm the returned connection supports transactions.
        if (
            !connection ||
            typeof connection.beginTransaction !== "function" ||
            typeof connection.query !== "function" ||
            typeof connection.release !== "function"
        ) {
            throw new Error(
                "Database pool did not return a valid connection."
            );
        }

        await connection.beginTransaction();
        transactionStarted = true;

        // Find and lock the user's active account.
        const [accounts] = await connection.query(
            `SELECT id, account_number, balance
             FROM accounts
             WHERE account_number = ?
               AND user_id = ?
               AND is_active = 1
             FOR UPDATE`,
            [account_number, userId]
        );

        if (accounts.length === 0) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(404).json({
                message: "Active account not found."
            });
        }

        const account = accounts[0];

        // Compare amounts in minor currency units to avoid
        // floating-point errors when checking the balance.
        const balanceInKobo = Math.round(
            Number(account.balance) * 100
        );

        const amountInKobo = Math.round(
            Number(amount) * 100
        );

        if (amountInKobo <= 0) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(400).json({
                message: "Withdrawal amount must be greater than zero."
            });
        }

        if (amountInKobo > balanceInKobo) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(400).json({
                message: "Insufficient account balance."
            });
        }

        // Deduct the withdrawal amount.
        await connection.query(
            `UPDATE accounts
             SET balance = balance - ?
             WHERE id = ?
               AND balance >= ?`,
            [amount, account.id, amount]
        );

        // Generate a unique transaction reference.
        const reference =
            `WDL-${uuidv4().replace(/-/g, "").slice(0, 16)}`;

        // Record the completed withdrawal.
        await connection.query(
            `INSERT INTO transactions
                (reference, type, amount, from_account_id,
                 to_account_id, description, status)
             VALUES (?, 'withdrawal', ?, ?, NULL, ?, 'completed')`,
            [
                reference,
                amount,
                account.id,
                description || null
            ]
        );

        // Commit the balance update and transaction record together.
        await connection.commit();
        transactionStarted = false;

        const remainingBalance = (
            (balanceInKobo - amountInKobo) / 100
        ).toFixed(2);

        return res.status(201).json({
            message: "Withdrawal successful.",
            transaction: {
                reference,
                type: "withdrawal",
                amount: Number(amount).toFixed(2),
                account_number: account.account_number,
                remaining_balance: remainingBalance,
                status: "completed"
            }
        });

    } catch (error) {
        if (connection && transactionStarted) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error(
                    "Withdrawal rollback error:",
                    rollbackError
                );
            }
        }

        console.error("Withdrawal error:", error);

        return res.status(500).json({
            message: "Internal server error."
        });

    } finally {
        if (connection && typeof connection.release === "function") {
            connection.release();
        }
    }
};

const transfer = async (req, res) => {
    let connection;
    let transactionStarted = false;

    try {
        const userId = req.user.userId;
        const {
            from_account_number,
            to_account_number,
            amount,
            description
        } = req.body;

        //prevents transferring to the same account
        if(from_account_number === to_account_number) {
            return res.status(400).json({
                message: "Source and destination accounts must be different."
            });
        }

        connection = await pool.getConnection();

        await connection.beginTransaction();
        transactionStarted = true;

        const accountNumbers = [
            from_account_number,
            to_account_number
        ].sort();

        const [accounts] = await connection.query(
            `SELECT id, account_number, user_id, balance
            FROM accounts 
            WHERE account_number IN (?, ?)
              AND is_active = 1
            ORDER BY account_number
            FOR UPDATE`,
            accountNumbers
        );

const sourceAccount = accounts.find(
    account =>
        String(account.account_number) === String(from_account_number) &&
        String(account.user_id) === String(userId)
);

const destinationAccount = accounts.find(
    account =>
        String(account.account_number) === String(to_account_number)
);

// Confirm the source account belongs to the logged-in user.
if (!sourceAccount) {
    await connection.rollback();
    transactionStarted = false;

    return res.status(404).json({
        message: "Active source account not found."
    });
}

// Confirm the destination account exists and is active.
if (!destinationAccount) {
    await connection.rollback();
    transactionStarted = false;

    return res.status(404).json({
        message: "Active destination account not found."
    });
}


        const balanceInKobo = Math.round(
            Number(sourceAccount.balance) * 100
        );
        const amountInKobo = Math.round(
            Number(amount) * 100
        );

        if (amountInKobo <= 0) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(400).json({
                message: "Transfer amount must be greater than zero."
            });
        }

        if (amountInKobo > balanceInKobo) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(400).json({
                message: "Insufficient account balance."
            });
        }

        // Debit the source account.
        await connection.query(
            `UPDATE accounts
             SET balance = balance - ?
             WHERE id = ?
               AND balance >= ?`,
            [amount, sourceAccount.id, amount]
        );

        // Credit the destination account.
        await connection.query(
            `UPDATE accounts
             SET balance = balance + ?
             WHERE id = ?`,
            [amount, destinationAccount.id]
        );

        const reference =
            `TRF-${uuidv4().replace(/-/g, "").slice(0, 16)}`;

        // Record the transfer as one transaction.
        await connection.query(
            `INSERT INTO transactions
                (reference, type, amount, from_account_id,
                 to_account_id, description, status)
             VALUES (?, 'transfer', ?, ?, ?, ?, 'completed')`,
            [
                reference,
                amount,
                sourceAccount.id,
                destinationAccount.id,
                description || null
            ]
        );

        await connection.commit();
        transactionStarted = false;

        return res.status(201).json({
            message: "Transfer successful.",
            transaction: {
                reference,
                type: "transfer",
                amount: Number(amount).toFixed(2),
                from_account_number,
                to_account_number,
                status: "completed"
            }
        });

    } catch (error) {
        if (connection && transactionStarted) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error(
                    "Transfer rollback error:",
                    rollbackError
                );
            }
        }

        console.error("Transfer error:", error);

        return res.status(500).json({
            message: "Internal server error."
        });

    } finally {
        if (connection && typeof connection.release === "function") {
            connection.release();
        }
    }
};
    
module.exports = {
    createAccount,
    getAccounts,
    getAccountDetails,
    getAccountHistory,
    getAccountSummary,
    deposit,
    withdraw,
    transfer
};