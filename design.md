# Bank Account REST API — Database Design

## Step 1: Entity Identification

### 1. Users

A user represents a person who has registered on the banking system and is allowed to use the application.

**Real-world object:** Bank customer/user.

### 2. Accounts

An account represents a bank account owned by a registered user. A user can have multiple active accounts, subject to the maximum account limit.

**Real-world object:** Customer bank account.

### 3. Transactions

A transaction represents a financial movement involving one or two bank accounts. The system supports deposits, withdrawals, and transfers.

**Real-world object:** Financial transaction.

### 4. Audit Log

An audit log represents a record of authentication-related activities performed by users, including registration and login events.

**Real-world object:** Security/audit event.

## Step 2: Attribute Mapping

### Entity: users

| Attribute     | Type         | Constraints                         | Description            |
| ------------- | ------------ | ----------------------------------- | ---------------------- |
| id            | INT          | PRIMARY KEY, AUTO_INCREMENT         | Unique user identifier |
| full_name     | VARCHAR(150) | NOT NULL                            | User's full name       |
| email         | VARCHAR(255) | NOT NULL, UNIQUE                    | User's email address   |
| phone         | VARCHAR(15)  | NOT NULL, UNIQUE                    | User's phone number    |
| password_hash | VARCHAR(255) | NOT NULL                            | Bcrypt password hash   |
| is_active     | TINYINT(1)   | NOT NULL, DEFAULT 1                 | User account status    |
| created_at    | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Registration time      |

**Type justification:** `phone` is stored as `VARCHAR` rather than a numeric type because phone numbers are identifiers, not values used for mathematical calculations, and may contain leading zeros. `password_hash` stores the bcrypt hash rather than the user's plain-text password.

### Entity: accounts

| Attribute      | Type                                | Constraints                         | Description                         |
| -------------- | ----------------------------------- | ----------------------------------- | ----------------------------------- |
| id             | INT                                 | PRIMARY KEY, AUTO_INCREMENT         | Unique account identifier           |
| user_id        | INT                                 | NOT NULL, FOREIGN KEY               | ID of the user who owns the account |
| account_number | CHAR(10)                            | NOT NULL, UNIQUE                    | Unique 10-digit account number      |
| account_type   | ENUM('savings', 'current', 'fixed') | NOT NULL                            | Type of bank account                |
| balance        | DECIMAL(15,2)                       | NOT NULL, DEFAULT 0.00              | Current account balance             |
| currency       | CHAR(3)                             | NOT NULL, DEFAULT 'NGN'             | Three-letter currency code          |
| is_active      | TINYINT(1)                          | NOT NULL, DEFAULT 1                 | Account status                      |
| created_at     | TIMESTAMP                           | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation time               |

**Type justification:** `account_number` uses `CHAR(10)` because it is an identifier rather than a number used for calculations. `balance` uses `DECIMAL(15,2)` instead of `FLOAT` because financial values require exact decimal precision. `currency` uses `CHAR(3)` because standard currency codes such as NGN and USD contain three characters.

### Entity: transactions

| Attribute       | Type                                      | Constraints                         | Description                        |
| --------------- | ----------------------------------------- | ----------------------------------- | ---------------------------------- |
| id              | INT                                       | PRIMARY KEY, AUTO_INCREMENT         | Unique transaction identifier      |
| reference       | VARCHAR(50)                               | NOT NULL, UNIQUE                    | Unique transaction reference       |
| type            | ENUM('deposit', 'withdrawal', 'transfer') | NOT NULL                            | Type of financial transaction      |
| amount          | DECIMAL(15,2)                             | NOT NULL                            | Amount involved in the transaction |
| from_account_id | INT                                       | NULL, FOREIGN KEY                   | Account from which money is taken  |
| to_account_id   | INT                                       | NULL, FOREIGN KEY                   | Account to which money is sent     |
| description     | VARCHAR(255)                              | NULL                                | Optional transaction description   |
| status          | ENUM('pending', 'completed', 'failed')    | NOT NULL, DEFAULT 'completed'       | Transaction status                 |
| created_at      | TIMESTAMP                                 | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Transaction creation time          |

**Type justification:** `amount` uses `DECIMAL(15,2)` because financial amounts require exact decimal precision. `from_account_id` and `to_account_id` are nullable because deposits do not have a source account and withdrawals do not have a destination account.

### Entity: audit_log

| Attribute  | Type                      | Constraints                         | Description                     |
| ---------- | ------------------------- | ----------------------------------- | ------------------------------- |
| id         | INT                       | PRIMARY KEY, AUTO_INCREMENT         | Unique audit record identifier  |
| user_id    | INT                       | NOT NULL, FOREIGN KEY               | User who performed the action   |
| action     | ENUM('register', 'login') | NOT NULL                            | Authentication action performed |
| ip_address | VARCHAR(45)               | NOT NULL                            | IP address of the request       |
| created_at | TIMESTAMP                 | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Time the action occurred        |

**Type justification:** `ip_address` uses `VARCHAR(45)` because it can store both IPv4 and IPv6 addresses.


## Step 3: Relationship Mapping

### 1. Users → Accounts

**Relationship:** One-to-Many (1:N)

* One user can own multiple accounts.
* Each account belongs to one user.
* Foreign key: `accounts.user_id` references `users.id`.
* Delete rule: `ON DELETE RESTRICT`.

**Justification:** A user may have multiple accounts, but each account must have one owner. `RESTRICT` prevents a user from being deleted while their financial accounts still exist.

---

### 2. Users → Audit Log

**Relationship:** One-to-Many (1:N)

* One user can have multiple audit log records.
* Each audit log record belongs to one user.
* Foreign key: `audit_log.user_id` references `users.id`.
* Delete rule: `ON DELETE RESTRICT`.

**Justification:** A user can perform multiple authentication actions, such as registering and logging in multiple times. `RESTRICT` protects the audit history from being automatically deleted.

---

### 3. Accounts → Transactions through `from_account_id`

**Relationship:** One-to-Many (1:N)

* One account can be the source of many transactions.
* A transaction may have one source account.
* Foreign key: `transactions.from_account_id` references `accounts.id`.
* Delete rule: `ON DELETE RESTRICT`.

**Justification:** Withdrawals and transfers can take money from an account. The field is nullable because deposits do not have a source account.

---

### 4. Accounts → Transactions through `to_account_id`

**Relationship:** One-to-Many (1:N)

* One account can receive many transactions.
* A transaction may have one destination account.
* Foreign key: `transactions.to_account_id` references `accounts.id`.
* Delete rule: `ON DELETE RESTRICT`.

**Justification:** Deposits and transfers can send money to an account. The field is nullable because withdrawals do not have a destination account.

---

### Relationship Summary

| Parent Entity | Child Entity | Relationship | Foreign Key                  | ON DELETE |
| ------------- | ------------ | ------------ | ---------------------------- | --------- |
| users         | accounts     | 1:N          | accounts.user_id             | RESTRICT  |
| users         | audit_log    | 1:N          | audit_log.user_id            | RESTRICT  |
| accounts      | transactions | 1:N          | transactions.from_account_id | RESTRICT  |
| accounts      | transactions | 1:N          | transactions.to_account_id   | RESTRICT  |


## Step 4
## ERD DIAGRAM

┌─────────────────────┐
│       USERS         │
├─────────────────────┤
│ PK id               │
│ full_name           │
│ email               │
│ phone               │
│ password_hash       │
│ is_active           │
│ created_at          │
└──────────┬──────────┘
           │
           │ 1
           │
           │ N
┌──────────▼──────────┐
│      ACCOUNTS       │
├─────────────────────┤
│ PK id               │
│ FK user_id          │
│ account_number      │
│ account_type        │
│ balance             │
│ currency            │
│ is_active           │
│ created_at          │
└───────┬───────┬─────┘
        │       │
      1 │       │ 1
        │       │
      N │       │ N
        │       │
        └───┬───┘
            │
┌───────────▼───────────┐
│     TRANSACTIONS      │
├───────────────────────┤
│ PK id                 │
│ reference             │
│ type                  │
│ amount                │
│ FK from_account_id    │
│ FK to_account_id      │
│ description           │
│ status                │
│ created_at            │
└───────────────────────┘


┌─────────────────────┐
│       USERS         │
└──────────┬──────────┘
           │ 1
           │
           │ N
┌──────────▼──────────┐
│     AUDIT_LOG       │
├─────────────────────┤
│ PK id               │
│ FK user_id          │
│ action              │
│ ip_address          │
│ created_at          │
└─────────────────────┘

## Step 5: Normalisation to 3NF

### First Normal Form (1NF)

The database satisfies 1NF because each attribute contains a single atomic value and there are no repeating groups.

For example, a user does not store multiple account numbers in one field. Instead, each account is stored as a separate record in the `accounts` table and linked to the user through `user_id`.

### Second Normal Form (2NF)

The database satisfies 2NF because all tables are already in 1NF and use single-column primary keys.

Since each primary key consists of one attribute, there are no partial dependencies on part of a composite primary key.

### Third Normal Form (3NF)

The database satisfies 3NF because non-key attributes depend on the primary key of their own table and not on other non-key attributes.

For example, user information such as `full_name`, `email`, and `phone` is stored in the `users` table rather than being repeated in the `accounts` table.

Account information is stored separately in `accounts`, transaction information is stored in `transactions`, and authentication events are stored in `audit_log`.

Therefore, the final database design is normalized to 3NF and reduces unnecessary data duplication and update anomalies.


## Step 6 — Final Schema Summary

We have 4 tables.

1. users

Stores information about people registered on the system.

Column	Type	Key / Constraint
id	INT	PK, AUTO_INCREMENT
full_name	VARCHAR(150)	NOT NULL
email	VARCHAR(255)	NOT NULL, UNIQUE
phone	VARCHAR(15)	NOT NULL, UNIQUE
password_hash	VARCHAR(255)	NOT NULL
is_active	TINYINT(1)	NOT NULL, DEFAULT 1
created_at	TIMESTAMP	DEFAULT CURRENT_TIMESTAMP
2. accounts

Stores bank accounts belonging to users.

Column	Type	Key / Constraint
id	INT	PK, AUTO_INCREMENT
user_id	INT	FK → users.id
account_number	CHAR(10)	NOT NULL, UNIQUE
account_type	ENUM	savings/current/fixed
balance	DECIMAL(15,2)	NOT NULL, DEFAULT 0
currency	CHAR(3)	NOT NULL, DEFAULT NGN
is_active	TINYINT(1)	NOT NULL, DEFAULT 1
created_at	TIMESTAMP	DEFAULT CURRENT_TIMESTAMP

Relationship:

users 1 ───────── N accounts
3. transactions

Stores deposits, withdrawals and transfers.

Column	Type	Key / Constraint
id	INT	PK, AUTO_INCREMENT
reference	VARCHAR(50)	NOT NULL, UNIQUE
type	ENUM	deposit/withdrawal/transfer
amount	DECIMAL(15,2)	NOT NULL
from_account_id	INT	FK → accounts.id, NULL
to_account_id	INT	FK → accounts.id, NULL
description	VARCHAR(255)	NULL
status	ENUM	pending/completed/failed
created_at	TIMESTAMP	DEFAULT CURRENT_TIMESTAMP

Relationships:

accounts 1 ───────── N transactions
             from_account_id

accounts 1 ───────── N transactions
             to_account_id
4. audit_log

Stores registration and login activities.

Column	Type	Key / Constraint
id	INT	PK, AUTO_INCREMENT
user_id	INT	FK → users.id
action	ENUM	register/login
ip_address	VARCHAR(45)	NOT NULL
created_at	TIMESTAMP	DEFAULT CURRENT_TIMESTAMP

Relationship:

users 1 ───────── N audit_log
One more thing before SQL

There are a few business rules that aren't completely handled just by our table structure:

1. A user can have at most 3 ACTIVE accounts.
2. Account number must be exactly 10 digits.
3. Balance cannot go below 0.
4. Deposit → destination account required.
5. Withdrawal → source account required.
6. Transfer → both source and destination required.

Some of these belong in the database, while others will be enforced by our Node.js application and transactions.

We'll handle that properly when we build schema.sql and the API.