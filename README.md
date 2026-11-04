# Bank Account REST API

A backend engineering capstone project that implements a RESTful API for managing users, bank accounts, balances, and financial transactions.

Built with **Node.js, Express.js, MySQL/MariaDB, and JWT authentication**, the project demonstrates relational database design, normalization, raw SQL queries, validation, security, and transactional integrity.

## Project Overview

The Bank Account REST API allows users to:

- Register and securely log in.
- Create and manage bank accounts.
- View their active accounts.
- Deposit money.
- Withdraw money.
- Transfer money between accounts.
- View account transaction history.
- View account balance summaries.
- Authenticate requests using JWT Bearer tokens.

The project was developed as a backend engineering capstone covering both database design and REST API implementation.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MySQL/MariaDB | Relational database |
| mysql2 | Database driver |
| Joi | Request validation |
| bcrypt | Password hashing |
| JSON Web Token (JWT) | Authentication |
| dotenv | Environment variable management |
| UUID | Transaction reference generation |

### Key Concepts

- REST API design
- Relational database design
- Entity Relationship Diagrams (ERD)
- Database normalization up to 3NF
- Raw SQL queries
- SQL JOINs
- Aggregate functions
- Correlated subqueries
- Database transactions
- JWT authentication
- Password hashing
- Input validation
- Parameterized queries
- Pagination
- Account ownership and authorization

##  Project Structure

```text
bank_api/
│
├── controllers/
│   ├── authController.js
│   └── accountController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── validate.js
│
├── validators/
│   ├── authValidators.js
│   └── accountValidators.js
│
├── .env
├── .env.example
├── .gitignore
├── db.js
├── design.md
├── index.js
├── package.json
├── package-lock.json
├── README.md
├── router.js
└── schema.sql
```

##  Database Design

The database is designed and normalized to **Third Normal Form (3NF)**.

It contains four main tables:

### 1. `users`

Stores registered users.

Key attributes:

- `id` – Primary key
- `full_name` – User's full name
- `email` – Unique email address
- `phone` – Unique phone number
- `password_hash` – Hashed password
- `is_active` – Account status
- `created_at` – Registration timestamp

### 2. `accounts`

Stores bank accounts belonging to users.

Key attributes:

- `id` – Primary key
- `user_id` – Foreign key referencing users
- `account_number` – Unique 10-digit account number
- `account_type` – Savings, current, or fixed
- `balance` – Account balance
- `currency` – Account currency
- `is_active` – Account status
- `created_at` – Creation timestamp

### 3. `transactions`

Stores financial transactions.

Supported transaction types:

- Deposit
- Withdrawal
- Transfer

Key attributes:

- `id` – Primary key
- `reference` – Unique transaction reference
- `type` – Transaction type
- `amount` – Transaction amount
- `from_account_id` – Source account
- `to_account_id` – Destination account
- `description` – Optional transaction description
- `status` – Transaction status
- `created_at` – Transaction timestamp

### 4. `audit_log`

Records important authentication events, including:

- User registration
- User login

Each audit record stores the associated user, action, IP address, and timestamp.

##  Authentication

The API uses **JWT Bearer Authentication** to protect private endpoints.

After successfully logging in, the user receives a JWT token.

Example:

```json
{
  "token": "your-jwt-token"
}
```

Protected requests must include the following HTTP header:

```http
Authorization: Bearer <token>
```

The JWT payload contains:

```json
{
  "userId": 1,
  "id": 1,
  "email": "user@example.com",
  "full_name": "User Name"
}
```

Passwords are never stored as plain text. They are hashed using `bcrypt` before being saved to the database.

##  Input Validation

Request bodies are validated using **Joi**.

Validation rules include:

- Valid email format
- Phone number format
- Strong passwords
- Matching password confirmation
- Valid account types
- Positive transaction amounts
- Maximum two decimal places for monetary amounts
- Valid 10-digit account numbers
- Different source and destination accounts for transfers

Invalid requests return a `400 Bad Request` response with validation error details.

##  API Endpoints

All endpoints are mounted under `/api`.

### Authentication

| Method | Endpoint | Authentication |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Accounts

| Method | Endpoint | Authentication |
|---|---|---|
| POST | `/api/accounts` | Bearer Token |
| GET | `/api/accounts` | Bearer Token |
| GET | `/api/accounts/summary` | Bearer Token |
| GET | `/api/accounts/:account_number` | Bearer Token |
| GET | `/api/accounts/:account_number/history` | Bearer Token |
| POST | `/api/accounts/deposit` | Bearer Token |
| POST | `/api/accounts/withdraw` | Bearer Token |
| POST | `/api/accounts/transfer` | Bearer Token |

##  API Usage Examples

### 1. Register a User

**Request**

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

**Example response**

```json
{
  "id": 1,
  "full_name": "Ada Okonkwo",
  "email": "ada@example.com"
}
```

A successful registration returns `201 Created`.

### 2. Login

**Request**

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

**Example response**

```json
{
  "token": "your-jwt-token"
}
```

A successful login returns `200 OK`.

### 3. Create an Account

**Request**

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

A successful request creates an account with:

- A unique 10-digit account number.
- An initial balance of zero.
- The authenticated user as the account owner.

A user can have a maximum of three active accounts.

### 4. List Accounts

**Request**

```http
GET /api/accounts
Authorization: Bearer <token>
```

Returns the authenticated user's active accounts.

The endpoint uses SQL JOINs to retrieve account owner information, including `owner_name`.

### 5. Account Details

**Request**

```http
GET /api/accounts/3012345678
Authorization: Bearer <token>
```

Returns account information and `total_transactions`, calculated using a scalar subquery.

Users cannot access another user's private account details.

### 6. Deposit

**Request**

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

The deposit operation:

1. Verifies account ownership.
2. Checks that the account is active.
3. Locks the account row.
4. Updates the account balance.
5. Creates a transaction record.
6. Commits the database transaction.

A successful deposit returns `200 OK`, the transaction reference, and the new balance.

### 7. Withdrawal

**Request**

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

A successful withdrawal returns `200 OK` and the remaining balance.

### 8. Transfer

**Request**

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

Transfers are handled using a MySQL database transaction.

The operation:

1. Verifies the source account belongs to the authenticated user.
2. Checks that both accounts are active.
3. Locks the relevant account rows.
4. Checks the sender's available balance.
5. Debits the sender's account.
6. Credits the receiver's account.
7. Records the transfer.
8. Commits the transaction.

If an operation fails, the entire transaction is rolled back to prevent partial transfers.

A successful transfer returns `200 OK`.

### 9. Transaction History

**Request**

```http
GET /api/accounts/3012345678/history?page=1&limit=10
Authorization: Bearer <token>
```

Returns paginated transaction history for an account.

The endpoint uses multiple LEFT JOINs to retrieve:

- Source account information.
- Source account owner's name (`from_owner_name`).
- Destination account information.
- Destination account owner's name (`to_owner_name`).

Pagination is supported through the `page` and `limit` query parameters.

### 10. Account Summary

**Request**

```http
GET /api/accounts/summary
Authorization: Bearer <token>
```

The endpoint returns two sections: account summary and transaction summary.

**Example response structure**

```json
{
  "account_summary": {
    "total_accounts": "3",
    "total_balance": "4901.71",
    "highest_balance": "3000.00",
    "lowest_balance": "901.71",
    "savings_accounts": "2",
    "current_accounts": "1",
    "fixed_accounts": "0"
  },
  "transaction_summary": {
    "total_debits": "2600.00",
    "total_credits": "7501.71",
    "total_deposits": "6501.71",
    "total_withdrawals": "1000.00",
    "total_transfers_sent": "1600.00",
    "total_transfers_received": "1000.00"
  }
}
```

*The figures above are illustrative and depend on the user's actual account and transaction records.*

The endpoint demonstrates:

- Aggregate functions (`COUNT`, `SUM`, `MAX`, `MIN`).
- Correlated subqueries.
- SQL joins.
- Conditional aggregation.

##  Database Transactions

Financial operations use database transactions to maintain data integrity.

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

This ensures that operations such as transfers either fully succeed or fully fail.

For example:

```text
Sender account
      |
      v
Subtract amount
      |
      v
Receiver account
      |
      v
Add amount
      |
      v
Create transaction record
      |
      v
COMMIT
```

If any operation fails:

```text
ROLLBACK
```

No partial financial operation is saved.

##  Security

The project implements several backend security practices:

- Passwords are hashed using `bcrypt`.
- JWT is used for authentication.
- JWT secrets are stored in environment variables.
- `.env` is excluded from Git.
- SQL queries use parameterized values.
- User input is validated before processing.
- Protected routes require authentication.
- Account ownership is checked before financial operations.
- Inactive accounts cannot perform financial operations.
- Users cannot overdraw their accounts.
- Authentication events are recorded in the audit log.

##  Installation and Setup

### Prerequisites

Ensure the following are installed:

- Node.js
- npm
- MySQL or MariaDB
- Postman (for API testing)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bank_api
```

Replace `<repository-url>` with the actual GitHub repository URL.

### 2. Install Dependencies

```bash
npm install
```

This installs the dependencies declared in `package.json`.

### 3. Create the Database

Create the database:

```sql
CREATE DATABASE bank_api;
```

### 4. Run the Database Schema

Execute:

```bash
mysql -u root -p < schema.sql
```

The schema creates the four database tables, relationships, indexes, and constraints.

**Important:** `schema.sql` contains DROP statements to recreate the tables. Run it only when setting up a fresh database or when you intentionally want to reset the existing tables. Do not run it against a database containing data you need to preserve.

### 5. Configure Environment Variables

Create a `.env` file in the project root using `.env.example` as a template.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=bank_api

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=2h

BCRYPT_SALT_ROUNDS=10
```

Update the database credentials and JWT secret to match your environment.

Never commit `.env` to Git.

### 6. Start the Server

```bash
node index.js
```

The application checks the database connection before starting the HTTP server.

When successful, the API will be available at:

```text
http://localhost:3000
```

Health and API routes should be tested using the endpoints documented above.

##  Testing

The API was tested using Postman against the capstone acceptance criteria.

Important scenarios include:

- User registration.
- Duplicate email and phone registration.
- Password validation.
- Login and invalid credentials.
- JWT authentication.
- Account creation and the three-account limit.
- Account listing and ownership checks.
- Account detail retrieval.
- Deposits and withdrawals.
- Insufficient balance handling.
- Transfers between accounts.
- Same-account transfer validation.
- Transaction history and pagination.
- Account summary calculations.
- Invalid request data.
- Inactive account restrictions.
- Database transaction rollback.

The project includes manual API testing. The default `npm test` script has not been configured as an automated test runner.

##  Database Integrity Rules

The database and application enforce the following core business rules:

- Users must have unique email addresses and phone numbers.
- Users can have a maximum of three active accounts.
- Account numbers must be unique and exactly 10 digits.
- Account balances cannot go below zero.
- Inactive accounts cannot perform financial operations.
- Deposits have a destination account only.
- Withdrawals have a source account only.
- Transfers have both source and destination accounts.
- Transfer source and destination accounts must be different.
- Every financial transaction has a unique reference.
- Financial operations are atomic.
- Transaction history can be retrieved using the transactions table.

##  Database Design Documentation

The Phase 1 database design is documented in:

```text
design.md
```

It contains:

- Entity identification.
- Attribute mapping.
- Data type justifications.
- Relationship mapping.
- Cardinality.
- Foreign key decisions.
- Entity Relationship Diagram (ERD).
- 1NF analysis.
- 2NF analysis.
- 3NF analysis.
- Final normalized schema.

The database implementation is contained in:

```text
schema.sql
```

## Project Objectives and Learning Outcomes

This project demonstrates practical backend engineering skills in:

1. Designing relational databases from business requirements.
2. Normalizing databases to Third Normal Form (3NF).
3. Building RESTful APIs with Express.js.
4. Writing raw SQL queries.
5. Working with SQL JOINs and subqueries.
6. Implementing authentication with JWT.
7. Hashing passwords securely.
8. Validating requests with Joi.
9. Managing financial operations with database transactions.
10. Protecting sensitive data and application secrets.
11. Implementing pagination.
12. Enforcing account ownership and data integrity.

##  Project Constraints

The project intentionally uses raw SQL rather than an Object Relational Mapper (ORM).

### Not used

- Sequelize
- Prisma
- Mongoose
- Passport
- Authentication frameworks

### Instead

- Raw SQL
- `mysql2/promise`
- JWT
- bcrypt
- Joi
- Express middleware

This provides hands-on experience with the underlying database and API concepts.

---

**Project:** Bank Account REST API  
**Version:** 1.0.0  
**Type:** Backend Engineering Capstone Project
