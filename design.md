# Bank Account REST API — Database Design

## Step 1: Entity Identification

The database consists of four main entities. Each entity represents a distinct real-world object within the banking system.

### 1. Users

A user represents a person who has registered on the banking system and is allowed to use the application.

**Real-world object:** Bank customer/user.

### 2. Accounts

An account represents a bank account owned by a registered user. A user can own multiple accounts, subject to the account creation rules defined by the application.

**Real-world object:** Customer bank account.

### 3. Transactions

A transaction represents a financial movement involving one or two bank accounts. The system supports deposits, withdrawals and transfers.

**Real-world object:** Financial transaction.

### 4. Audit Log

An audit log represents a record of authentication-related activities performed by users, including registration and login events.

**Real-world object:** Security/audit event.

---

## Step 2: Attribute Mapping

This section identifies the attributes belonging to each entity, their MySQL data types, constraints and purposes.

### Entity: users

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| full_name | VARCHAR(150) | NOT NULL | User's full name |
| email | VARCHAR(200) | NOT NULL, UNIQUE | User's email address |
| phone | VARCHAR(15) | NOT NULL, UNIQUE | User's phone number |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt password hash |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 | User account status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Registration time |

**Type justification:**

- `phone` is stored as `VARCHAR` rather than a numeric type because phone numbers are identifiers, not values used for mathematical calculations. This also allows leading zeros to be preserved.
- `password_hash` stores the hashed password rather than the user's plain-text password.
- `email` uses `VARCHAR(200)` to accommodate email addresses of varying lengths.

### Entity: accounts

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique account identifier |
| user_id | INT | NOT NULL, FOREIGN KEY | ID of the user who owns the account |
| account_number | CHAR(10) | NOT NULL, UNIQUE, CHECK (10 digits) | Unique 10-digit account number |
| account_type | ENUM('savings', 'current', 'fixed') | NOT NULL | Type of bank account |
| balance | DECIMAL(15,2) | NOT NULL, DEFAULT 0.00, CHECK (balance >= 0) | Current account balance |
| currency | CHAR(3) | NOT NULL, DEFAULT 'NGN' | Three-letter currency code |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 | Account status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation time |

**Type justification:**

- `account_number` uses `CHAR(10)` because it is an identifier rather than a number used for calculations. This preserves leading zeros.
- `balance` uses `DECIMAL(15,2)` instead of `FLOAT` because financial values require exact decimal precision.
- `currency` uses `CHAR(3)` because standard currency codes such as NGN and USD contain three characters.
- `account_type` uses `ENUM` to restrict account types to the supported values.

### Entity: transactions

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique transaction identifier |
| reference | VARCHAR(20) | NOT NULL, UNIQUE | Unique transaction reference |
| type | ENUM('deposit', 'withdrawal', 'transfer') | NOT NULL | Type of financial transaction |
| amount | DECIMAL(15,2) | NOT NULL, CHECK (amount > 0) | Amount involved in the transaction |
| from_account_id | INT | NULL, FOREIGN KEY | Account from which money is taken |
| to_account_id | INT | NULL, FOREIGN KEY | Account to which money is sent |
| description | VARCHAR(255) | NULL | Optional transaction description |
| status | ENUM('pending', 'completed', 'failed') | NOT NULL, DEFAULT 'completed' | Transaction status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Transaction creation time |

**Type justification:**

- `amount` uses `DECIMAL(15,2)` because financial amounts require exact decimal precision.
- `from_account_id` and `to_account_id` are nullable because deposits do not have a source account, while withdrawals do not have a destination account.
- `reference` uses `VARCHAR(20)` to store transaction references of varying lengths.
- `type` and `status` use `ENUM` to restrict entries to predefined transaction types and statuses.

Additional CHECK constraints enforce the correct account combinations for each transaction type:

- Deposits must have a destination account and no source account.
- Withdrawals must have a source account and no destination account.
- Transfers must have both source and destination accounts, and the two accounts must be different.

### Entity: audit_log

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique audit record identifier |
| user_id | INT | NOT NULL, FOREIGN KEY | User who performed the action |
| action | ENUM('register', 'login') | NOT NULL | Authentication action performed |
| ip_address | VARCHAR(45) | NOT NULL | IP address of the request |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Time the action occurred |

**Type justification:**

- `ip_address` uses `VARCHAR(45)` because it can store both IPv4 and IPv6 addresses.
- `action` uses `ENUM` to restrict audit events to the authentication activities supported by the system.

---

## Step 3: Relationship Mapping

This section explains the relationships between entities, their cardinalities, foreign keys and referential actions.

### 1. Users → Accounts

**Relationship:** One-to-Many (1:N)

- One user can own multiple accounts.
- Each account belongs to exactly one user.
- Foreign key: `accounts.user_id` references `users.id`.
- Delete rule: `ON DELETE RESTRICT`.
- Update rule: `ON UPDATE CASCADE`.

**Justification:**

A user may have multiple bank accounts, but each account must have one owner. `RESTRICT` prevents a user from being deleted while their accounts still exist. `CASCADE` ensures that an update to the referenced user ID is reflected in the related account records.

### 2. Users → Audit Log

**Relationship:** One-to-Many (1:N)

- One user can have multiple audit log records.
- Each audit log record belongs to exactly one user.
- Foreign key: `audit_log.user_id` references `users.id`.
- Delete rule: `ON DELETE RESTRICT`.
- Update rule: `ON UPDATE CASCADE`.

**Justification:**

A user can perform multiple authentication activities, such as registering and logging in multiple times. `RESTRICT` protects audit history from being automatically deleted when a user is deleted. `CASCADE` maintains referential consistency if the referenced user ID changes.

### 3. Accounts → Transactions through `from_account_id`

**Relationship:** One-to-Many (1:N)

- One account can be the source of many transactions.
- A transaction may have one source account or no source account, depending on its type.
- Foreign key: `transactions.from_account_id` references `accounts.id`.
- Delete rule: `ON DELETE RESTRICT`.
- Update rule: `ON UPDATE CASCADE`.

**Justification:**

Withdrawals and transfers can take money from an account. The field is nullable because deposits do not have a source account. `RESTRICT` protects transaction history from being deleted when an account is removed.

### 4. Accounts → Transactions through `to_account_id`

**Relationship:** One-to-Many (1:N)

- One account can receive many transactions.
- A transaction may have one destination account or no destination account, depending on its type.
- Foreign key: `transactions.to_account_id` references `accounts.id`.
- Delete rule: `ON DELETE RESTRICT`.
- Update rule: `ON UPDATE CASCADE`.

**Justification:**

Deposits and transfers can send money to an account. The field is nullable because withdrawals do not have a destination account. `RESTRICT` protects transaction history from being deleted when an account is removed.

### Relationship Summary

| Parent Entity | Child Entity | Relationship | Foreign Key | ON DELETE | ON UPDATE |
|---|---|---|---|---|---|
| users | accounts | 1:N | accounts.user_id | RESTRICT | CASCADE |
| users | audit_log | 1:N | audit_log.user_id | RESTRICT | CASCADE |
| accounts | transactions | 1:N | transactions.from_account_id | RESTRICT | CASCADE |
| accounts | transactions | 1:N | transactions.to_account_id | RESTRICT | CASCADE |

---

## Step 4: Entity Relationship Diagram (ERD)

The following diagram illustrates the entities, their primary keys, foreign keys and relationships.

```text
┌──────────────────────────┐
│          USERS           │
├──────────────────────────┤
│ PK id                    │
│ full_name                │
│ email                    │
│ phone                    │
│ password_hash            │
│ is_active                │
│ created_at               │
└────────────┬─────────────┘
             │
             │ 1
             │
             │ N
┌────────────▼─────────────┐
│         ACCOUNTS         │
├──────────────────────────┤
│ PK id                    │
│ FK user_id               │
│ account_number           │
│ account_type             │
│ balance                  │
│ currency                 │
│ is_active                │
│ created_at               │
└────────────┬─────────────┘
             │
             │ 1
             │
             │ N
       ┌─────▼────────────────────────┐
       │         TRANSACTIONS         │
       ├──────────────────────────────┤
       │ PK id                        │
       │ reference                    │
       │ type                         │
       │ amount                       │
       │ FK from_account_id (nullable)│
       │ FK to_account_id (nullable)  │
       │ description                  │
       │ status                       │
       │ created_at                   │
       └──────────────────────────────┘

       ACCOUNTS has two separate
       relationships with TRANSACTIONS:

       1. from_account_id: source account
       2. to_account_id: destination account


┌──────────────────────────┐
│          USERS           │
└────────────┬─────────────┘
             │
             │ 1
             │
             │ N
┌────────────▼─────────────┐
│        AUDIT_LOG         │
├──────────────────────────┤
│ PK id                    │
│ FK user_id               │
│ action                   │
│ ip_address               │
│ created_at               │
└──────────────────────────┘
```

**ERD Explanation:**

- A user can own multiple accounts, but each account belongs to one user.
- A user can have multiple audit log records, but each audit log record belongs to one user.
- An account can be involved in multiple transactions as a source account.
- An account can also be involved in multiple transactions as a destination account.
- The two transaction relationships are represented separately using `from_account_id` and `to_account_id`.

---

## Step 5: Database Normalisation

Normalisation is the process of organising database tables to reduce unnecessary duplication, improve data consistency and prevent insertion, update and deletion anomalies.

The database design was evaluated against First Normal Form (1NF), Second Normal Form (2NF) and Third Normal Form (3NF).

### 5.1 First Normal Form (1NF)

A table satisfies First Normal Form (1NF) when:

1. Each column contains atomic values.
2. Each record can be uniquely identified.
3. There are no repeating groups or multiple values stored in a single field.

**Application to the Bank API:**

The database satisfies 1NF because each attribute contains a single atomic value and there are no repeating groups.

For example, a user does not store multiple account numbers in one field. Instead, each account is stored as a separate record in the `accounts` table and linked to the user through `user_id`.

Similarly, transaction details are stored as individual records in the `transactions` table rather than storing multiple transactions in a single field.

**Conclusion:**

The database satisfies 1NF because its attributes contain individual values, records are uniquely identified by primary keys, and repeating groups are avoided.

### 5.2 Second Normal Form (2NF)

A table is in Second Normal Form (2NF) when it is already in First Normal Form (1NF), and every non-key attribute is fully functionally dependent on the entire primary key. This means there must be no partial dependencies.

A partial dependency occurs when a non-key attribute depends on only part of a composite primary key rather than the complete key.

**Review of the Bank API tables**

The following tables were considered during the 2NF analysis:

| Table | Primary Key | Composite Primary Key? |
|---|---|---|
| users | id | No |
| accounts | id | No |
| transactions | id | No |
| audit_log | id | No |

All four tables use a single-column primary key. None uses a composite primary key.

**Partial Dependency Analysis**

- `users`: User attributes such as full_name, email, phone and password_hash depend on the user's `id`.
- `accounts`: Attributes such as account_number, account_type, balance and currency depend on the account's `id`.
- `transactions`: Attributes such as reference, type, amount, description and status depend on the transaction's `id`.
- `audit_log`: Attributes such as user_id, action, ip_address and created_at describe the audit event identified by its `id`.

Since none of these tables has a composite primary key, there is no partial dependency to resolve.

**Conclusion**

The proposed database design satisfies the requirements of 2NF, provided that each non-key attribute depends on its table's primary key. No decomposition was necessary to eliminate partial dependencies because all identified tables use single-column primary keys.

### 5.3 Third Normal Form (3NF)

A table is in Third Normal Form (3NF) when it is already in Second Normal Form (2NF), and its non-key attributes depend directly on the primary key rather than on other non-key attributes.

This prevents transitive dependencies, which occur when a non-key attribute determines another non-key attribute.

The following design considerations were examined when normalising the Bank API database.

**Consideration 1: Users and Accounts**

An initial design could have stored a user's full_name and email directly in the accounts table alongside account information.

This would create unnecessary duplication because a single user can own multiple accounts. It could also cause inconsistencies if a user's personal information changes and not every account record is updated.

**Resolution:** Personal information such as full_name, email, phone and password_hash is stored in the users table. The accounts table stores user_id as a foreign key referencing users.id. User information can be retrieved using a JOIN when required.

**Consideration 2: Accounts and Transactions**

An initial design could have stored account_number and account_type directly in the transactions table alongside transaction details.

These attributes describe an account rather than a transaction. Since an account can be involved in many transactions, storing its details repeatedly would create unnecessary duplication and update anomalies.

**Resolution:** Account information remains in the accounts table. The transactions table stores from_account_id and to_account_id as foreign keys referencing accounts.id. Account details are retrieved through JOIN operations when transaction history is requested.

**Consideration 3: Users and Audit Logs**

An initial design could have stored full_name and email in every audit_log record.

However, users may register and log in many times, resulting in their personal information being repeated across multiple audit records.

**Resolution:** The audit_log table stores user_id, action, ip_address and created_at. The user's personal information remains in the users table and can be retrieved through the user_id foreign key.

**Clarification of the Design Decisions**

The three considerations above demonstrate how the database design avoids storing attributes that belong to other entities. They describe potential duplication that was avoided during the design process, rather than claiming that these transitive dependencies currently exist in the final schema.

In the final schema, each entity's descriptive attributes remain in its appropriate table, while foreign keys establish relationships between related entities.

**Review of All Tables**

| Table | 3NF Design Decision |
|---|---|
| users | Personal information is stored together and identified by the user's primary key. |
| accounts | User information is referenced through user_id instead of duplicated. |
| transactions | Account details are referenced through foreign keys instead of duplicated. |
| audit_log | User information is referenced through user_id instead of duplicated. |

**Conclusion**

The database design satisfies the requirements of Third Normal Form because the identified non-key attributes describe their respective entities and depend directly on their primary keys. Related entity information is stored in its appropriate table and accessed through foreign-key relationships.

This structure reduces data duplication and helps prevent insertion, update and deletion anomalies.

### 5.4 Final Normalised Schema Summary

The final database design consists of four tables: `users`, `accounts`, `transactions` and `audit_log`. Each table stores data relating to a specific entity. Relationships between entities are maintained using foreign keys to avoid unnecessary duplication.

#### 1. Users Table

Stores information about registered bank customers.

| Attribute | Data Type | Constraints |
|---|---|---|
| id | INT | Primary Key, Auto Increment |
| full_name | VARCHAR(150) | NOT NULL |
| email | VARCHAR(200) | NOT NULL, UNIQUE |
| phone | VARCHAR(15) | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

#### 2. Accounts Table

Stores bank account information. Each account belongs to one user through `user_id`.

| Attribute | Data Type | Constraints |
|---|---|---|
| id | INT | Primary Key, Auto Increment |
| user_id | INT | NOT NULL, Foreign Key |
| account_number | CHAR(10) | NOT NULL, UNIQUE, CHECK (10 digits) |
| account_type | ENUM | NOT NULL: savings, current, fixed |
| balance | DECIMAL(15,2) | NOT NULL, DEFAULT 0.00, CHECK (balance >= 0) |
| currency | CHAR(3) | NOT NULL, DEFAULT 'NGN' |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

#### 3. Transactions Table

Stores deposits, withdrawals and transfers involving bank accounts.

| Attribute | Data Type | Constraints |
|---|---|---|
| id | INT | Primary Key, Auto Increment |
| reference | VARCHAR(20) | NOT NULL, UNIQUE |
| type | ENUM | NOT NULL: deposit, withdrawal, transfer |
| amount | DECIMAL(15,2) | NOT NULL, CHECK (amount > 0) |
| from_account_id | INT | NULL, Foreign Key |
| to_account_id | INT | NULL, Foreign Key |
| description | VARCHAR(255) | NULL |
| status | ENUM | NOT NULL: pending, completed, failed; DEFAULT 'completed' |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

A CHECK constraint ensures that:

- Deposits have a destination account but no source account.
- Withdrawals have a source account but no destination account.
- Transfers have both source and destination accounts, and the two accounts must be different.

#### 4. Audit Log Table

Stores records of important user authentication activities.

| Attribute | Data Type | Constraints |
|---|---|---|
| id | INT | Primary Key, Auto Increment |
| user_id | INT | NOT NULL, Foreign Key |
| action | ENUM | NOT NULL: register, login |
| ip_address | VARCHAR(45) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

#### Data Type and Constraint Justification

- **INT:** Used for primary keys and foreign keys to identify records and establish relationships.
- **VARCHAR:** Used for variable-length text such as names, email addresses and descriptions.
- **CHAR:** Used for fixed-length values such as account numbers and currency codes. Account numbers are stored as strings to preserve leading zeros.
- **DECIMAL(15,2):** Used for monetary values to maintain accurate two-decimal-place financial calculations.
- **ENUM:** Restricts fields to predefined values, such as account types and transaction statuses.
- **TINYINT(1):** Used for Boolean-style fields such as account and user activation status.
- **TIMESTAMP:** Records when users, accounts, transactions and audit events are created.
- **PRIMARY KEY:** Uniquely identifies each record.
- **UNIQUE:** Prevents duplicate email addresses, phone numbers, account numbers and transaction references.
- **FOREIGN KEY:** Maintains referential integrity between related tables.
- **CHECK:** Enforces valid account numbers, non-negative account balances, positive transaction amounts and valid transaction account combinations.

#### Indexing Strategy

Indexes are provided on foreign-key columns to improve queries involving related records:

- `accounts.user_id`
- `audit_log.user_id`
- `transactions.from_account_id`
- `transactions.to_account_id`

Primary keys and unique constraints also create indexes to support efficient record lookup.

#### Final Normalisation Conclusion

The final database design separates user information, account information, financial transactions and audit records into their appropriate tables.

The design satisfies the principles of 1NF, 2NF and 3NF by keeping attributes atomic, avoiding partial dependencies and reducing transitive dependencies. Foreign keys establish relationships between the tables without repeatedly storing information that belongs to another entity.

This structure improves data consistency, reduces duplication and supports reliable banking operations.