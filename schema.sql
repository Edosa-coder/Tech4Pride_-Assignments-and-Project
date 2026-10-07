USE bank_api

DESCRIBE users;

ALTER TABLE users
ADD COLUMN phone VARCHAR(15) NOT NULL UNIQUE AFTER email;

DESCRIBE users;

ALTER TABLE users
CHANGE COLUMN first_name full_name VARCHAR(150) NOT NULL;

ALTER TABLE users
DROP COLUMN last_name;


CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action ENUM('register', 'login') NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);

DESCRIBE audit_log;

DELETE FROM audit_log
WHERE id > 0;

DELETE FROM users
WHERE id > 0;

SELECT COUNT(*) AS user_count
FROM users;

SELECT COUNT(*) AS audit_count
FROM audit_log;


SELECT
    id,
    full_name,
    email,
    phone,
    password_hash,
    is_active,
    created_at
FROM users;

SELECT
    id,
    user_id,
    action,
    ip_address,
    created_at
FROM audit_log;

DESCRIBE accounts;

SELECT COUNT(*) AS account_count
FROM accounts;

ALTER TABLE accounts
ADD COLUMN account_type ENUM('savings', 'current', 'fixed')
NOT NULL
AFTER account_number;

DESCRIBE accounts;
