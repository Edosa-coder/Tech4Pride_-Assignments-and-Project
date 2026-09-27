# Bank Account REST API

A production-style REST API for managing bank accounts, users, balances, and financial transactions. Built with **Node.js, Express, MySQL, and JWT authentication**, with a focus on database design, normalization, validation, security, and transactional integrity.

## Project Overview

The Bank Account REST API allows users to:

* Register and securely log in
* Create and manage bank accounts
* View their active accounts
* Deposit money
* Withdraw money
* Transfer money between accounts
* View account transaction history
* View account balance summaries
* Authenticate requests using JWT Bearer tokens

The project was developed as a backend engineering capstone, covering both **database design** and **REST API implementation**.

---

##  Tech Stack

| Technology           | Purpose                          |
| -------------------- | -------------------------------- |
| Node.js              | Backend runtime                  |
| Express.js           | REST API framework               |
| MySQL                | Relational database              |
| mysql2               | MySQL database driver            |
| Joi                  | Request validation               |
| bcrypt               | Password hashing                 |
| JSON Web Token (JWT) | Authentication                   |
| dotenv               | Environment variable management  |
| UUID                 | Transaction reference generation |

### Key Concepts

* REST API design
* Relational database design
* Entity Relationship Diagrams (ERD)
* Database normalization up to 3NF
* Raw SQL queries
* SQL JOINs
* Aggregate functions
* Correlated subqueries
* MySQL transactions
* JWT Bearer authentication
* Password hashing
* Input validation
* Parameterized queries

---

##  Project Structure

```text
bank-api/
│
├── index.js
├── db.js
├── router.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── validate.js
│
├── validators/
│   ├── authValidators.js
│   └── accountValidators.js
│
├── controllers/
│   ├── authController.js
│   └── accountController.js
│
├── design.md
├── schema.sql
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

##  Database Design

The database is designed and normalized to **Third Normal Form (3NF)**.

### Main Tables

#### `users`

Stores registered users.

Key information includes:

* User ID
* Full name
* Email
* Phone number
* Hashed password
* Active/inactive status
* Creation timestamp

#### `accounts`

Stores bank accounts belonging to users.

Key information includes:

* Account ID
* Unique 10-digit account number
* Account type
* Balance
* Currency
* Account owner
* Active/inactive status
* Creation timestamp

#### `transactions`

Stores all financial transactions.

Supported transaction types:

* Deposit
* Withdrawal
* Transfer

Each transaction contains:

* Unique transaction ID
* Reference code
* Transaction type
* Amount
* Source account
* Destination account
* Description
* Status
* Creation timestamp

#### `audit_log`

Records important authentication events such as:

* User registration
* User login

Each audit record stores the associated user, action, IP address, and timestamp.

---

##  Authentication

The API uses **JWT Bearer Authentication** for protected routes.

After successfully logging in, the user receives a JWT:

```json
{
  "token": "your-jwt-token"
}
```

Protected requests must include:

```http
Authorization: Bearer <token>
```

JWT payloads contain:

```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "User Name"
}
```

Passwords are never stored as plain text. They are hashed using `bcrypt` before being saved to the database.

---

##  Validation

Request bodies are validated using **Joi**.

Examples of validation rules include:

* Valid email format
* Phone number length and numeric format
* Strong passwords
* Matching password confirmation
* Valid account types
* Positive transaction amounts
* Maximum two decimal places
* Valid 10-digit account numbers
* Different source and destination accounts for transfers

Validation errors return a `400 Bad Request` response containing a `details` array.

Example:

```json
{
  "error": "Validation failed",
  "details": [
    "\"password\" must contain at least one uppercase character"
  ]
}
```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Authentication |
| ------ | -------------------- | -------------- |
| POST   | `/api/auth/register` | Public         |
| POST   | `/api/auth/login`    | Public         |

### Accounts

| Method | Endpoint                                | Authentication |
| ------ | --------------------------------------- | -------------- |
| POST   | `/api/accounts`                         | Bearer Token   |
| GET    | `/api/accounts`                         | Bearer Token   |
| GET    | `/api/accounts/summary`                 | Bearer Token   |
| GET    | `/api/accounts/:account_number`         | Bearer Token   |
| GET    | `/api/accounts/:account_number/history` | Bearer Token   |
| POST   | `/api/accounts/deposit`                 | Bearer Token   |
| POST   | `/api/accounts/withdraw`                | Bearer Token   |
| POST   | `/api/accounts/transfer`                | Bearer Token   |

---

#  API Usage

## 1. Register a User

### Request

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "full_name": "Ada Okonkwo",
  "email": "ada@example.com",
  "phone": "08012345678",
  "password": "Secret@123",
  "confirm_password": "Secret@123"
}
```

### Response

```json
{
  "id": 1,
  "full_name": "Ada Okonkwo",
  "email": "ada@example.com"
}
```

---

## 2. Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "ada@example.com",
  "password": "Secret@123"
}
```

### Response

```json
{
  "token": "your-jwt-token"
}
```

---

## 3. Create an Account

```http
POST /api/accounts
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "account_type": "savings",
  "currency": "NGN"
}
```

A user can have a maximum of **three active accounts**.

---

## 4. List Accounts

```http
GET /api/accounts
Authorization: Bearer <token>
```

Returns the authenticated user's active accounts.

The endpoint uses a SQL `JOIN` to retrieve the account owner's name.

---

## 5. Account Details

```http
GET /api/accounts/3012345678
Authorization: Bearer <token>
```

Returns account information and the total number of transactions associated with the account.

---

## 6. Deposit

```http
POST /api/accounts/deposit
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "account_number": "3012345678",
  "amount": 50000,
  "description": "Cash deposit"
}
```

The deposit:

1. Verifies account ownership
2. Checks that the account is active
3. Updates the account balance
4. Creates a transaction record
5. Commits the database transaction

---

## 7. Withdrawal

```http
POST /api/accounts/withdraw
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "account_number": "3012345678",
  "amount": 20000
}
```

Withdrawals cannot cause an account balance to fall below zero.

An insufficient balance returns:

```http
422 Unprocessable Entity
```

---

## 8. Transfer

```http
POST /api/accounts/transfer
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "from_account_number": "3012345678",
  "to_account_number": "3087654321",
  "amount": 10000,
  "description": "Transfer"
}
```

Transfers are handled using a **MySQL database transaction**.

Both account balances and the transaction record are committed together. If any operation fails, the entire transaction is rolled back.

---

## 9. Transaction History

```http
GET /api/accounts/3012345678/history?page=1&limit=10
Authorization: Bearer <token>
```

Returns paginated transaction history for an account.

The query uses multiple `LEFT JOIN`s to resolve:

* Source account
* Source account owner
* Destination account
* Destination account owner

---

## 10. Account Summary

```http
GET /api/accounts/summary
Authorization: Bearer <token>
```

Returns information such as:

```json
{
  "full_name": "Ada Okonkwo",
  "email": "ada@example.com",
  "total_accounts": 2,
  "total_balance": 150000,
  "highest_balance": 100000,
  "lowest_balance": 50000,
  "total_debits": 4,
  "total_credits": 6
}
```

The endpoint demonstrates:

* `GROUP BY`
* Aggregate functions
* Correlated subqueries
* SQL joins

---

#  Database Transactions

Financial operations use MySQL transactions to maintain data integrity.

The general pattern is:

```javascript
const conn = await pool.getConnection();

try {
    await conn.beginTransaction();

    // Database operations

    await conn.commit();
} catch (error) {
    await conn.rollback();

    // Handle error
} finally {
    conn.release();
}
```

This ensures that operations such as transfers either **fully succeed or fully fail**.

For example, during a transfer:

```text
Sender balance
      ↓
Subtract amount
      ↓
Receiver balance
      ↓
Add amount
      ↓
Create transaction record
      ↓
COMMIT
```

If any step fails:

```text
ROLLBACK
```

No partial financial operation is saved.

---

#  Security

The project follows several backend security practices:

* Passwords are hashed using `bcrypt`
* JWT is used for authentication
* JWT secrets are stored in environment variables
* `.env` is excluded from Git
* SQL queries use parameterized values
* User input is not concatenated directly into SQL
* Protected routes require authentication
* Account ownership is checked before financial operations
* Inactive accounts cannot perform financial operations
* Users cannot overdraw their accounts
* Authentication events are recorded in the audit log

---

#  Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd bank-api
```

## 2. Install dependencies

```bash
npm install
```

Required packages:

```bash
npm install express mysql2 joi jsonwebtoken bcrypt dotenv uuid
```

---

## 3. Create the Database

Create the MySQL database:

```sql
CREATE DATABASE bank_api;
```

Run the schema:

```bash
mysql -u root -p bank_api < schema.sql
```

---

## 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=bank_api

JWT_SECRET=replace_with_long_random_string
JWT_EXPIRES_IN=2h

BCRYPT_SALT_ROUNDS=10
```

Do not commit `.env` to Git.

A `.env.example` file is included as a template.

---

## 5. Start the Server

```bash
node index.js
```

The API will run on:

```text
http://localhost:3000
```

---

#  Testing

The API can be tested using **Postman**, Thunder Client, or another REST API client.

The following scenarios should be tested:

* User registration
* Duplicate email registration
* Duplicate phone registration
* Login
* Invalid credentials
* JWT authentication
* Account creation
* Three-account limit
* Account listing
* Account ownership
* Deposits
* Withdrawals
* Insufficient funds
* Transfers
* Same-account transfers
* Transaction history
* Pagination
* Account summary
* Invalid request data
* Inactive accounts
* Database transaction rollback

---

# Database Integrity Rules

The API enforces the following core business rules:

* Users must have unique emails and phone numbers.
* Users can have a maximum of three active accounts.
* Account numbers are unique and exactly 10 digits.
* Account balances cannot go below zero.
* Inactive accounts cannot perform financial operations.
* Deposits have a destination account only.
* Withdrawals have a source account only.
* Transfers have both source and destination accounts.
* Every financial transaction has a unique reference.
* Financial operations are atomic.
* Transaction history can be reconstructed from the transactions table.

---

# Database Design Documentation

The Phase 1 database design is documented in:

```text
design.md
```

It contains:

* Entity identification
* Attribute mapping
* Data type justifications
* Relationship mapping
* Cardinality
* Foreign key decisions
* ERD
* 1NF analysis
* 2NF analysis
* 3NF analysis
* Final normalized schema

The database implementation is contained in:

```text
schema.sql
```

---

# Project Objectives

This project demonstrates practical backend engineering skills in:

1. Designing relational databases from business requirements
2. Normalizing databases to 3NF
3. Building RESTful APIs with Express
4. Writing raw SQL queries
5. Working with MySQL joins and subqueries
6. Implementing authentication with JWT
7. Hashing passwords securely
8. Validating requests with Joi
9. Managing financial operations with database transactions
10. Protecting sensitive data and application secrets

---

#  Project Constraints

The project intentionally avoids ORMs and authentication frameworks.

### Not used

* Sequelize
* Prisma
* Mongoose
* Passport
* Auth frameworks

### Instead

* Raw SQL
* `mysql2/promise`
* JWT
* bcrypt
* Joi
* Express middleware

This provides hands-on experience with the underlying database and API concepts.

---

#  Learning Outcomes

By completing this project, the following backend concepts are demonstrated:

* Database schema design
* ER modeling
* Database normalization
* Primary and foreign keys
* Referential integrity
* REST API architecture
* Middleware
* Authentication and authorization
* Password security
* Input validation
* Parameterized SQL
* SQL joins
* Aggregation
* Subqueries
* Pagination
* Database transactions
* Error handling
* Environment configuration

---

apstone project using Node.js, Express, and MySQL.
