
-- =====================================================
-- BANK ACCOUNT REST API
-- Database Schema
-- Compatible with MariaDB 10.4+
-- =====================================================

USE bank_api;

-- Drop existing tables in dependency order.
-- WARNING: This deletes existing table data.
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS audit;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 1. USERS TABLE
-- =====================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 2. ACCOUNTS TABLE
-- =====================================================

CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    account_number CHAR(10) NOT NULL UNIQUE,
    account_type ENUM('savings', 'current', 'fixed') NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    currency CHAR(3) NOT NULL DEFAULT 'NGN',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_account_number
        CHECK (account_number REGEXP '^[0-9]{10}$'),

    CONSTRAINT chk_account_balance
        CHECK (balance >= 0),

    CONSTRAINT fk_accounts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_accounts_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 3. AUDIT LOG TABLE
-- =====================================================

CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action ENUM('register', 'login') NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_log_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_audit_log_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 4. TRANSACTIONS TABLE
-- =====================================================

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference VARCHAR(20) NOT NULL UNIQUE,
    type ENUM('deposit', 'withdrawal', 'transfer') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    from_account_id INT NULL,
    to_account_id INT NULL,
    description VARCHAR(255) NULL,
    status ENUM('pending', 'completed', 'failed')
        NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_transaction_amount
        CHECK (amount > 0),

    CONSTRAINT chk_transaction_accounts
        CHECK (
            (type = 'deposit'
                AND from_account_id IS NULL
                AND to_account_id IS NOT NULL)
            OR
            (type = 'withdrawal'
                AND from_account_id IS NOT NULL
                AND to_account_id IS NULL)
            OR
            (type = 'transfer'
                AND from_account_id IS NOT NULL
                AND to_account_id IS NOT NULL
                AND from_account_id <> to_account_id)
        ),

    CONSTRAINT fk_transactions_from_account
        FOREIGN KEY (from_account_id)
        REFERENCES accounts(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_transactions_to_account
        FOREIGN KEY (to_account_id)
        REFERENCES accounts(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_transactions_from_account (from_account_id),
    INDEX idx_transactions_to_account (to_account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT @@check_constraint_checks;