const fs = require("fs");

// accounts from JSON file
const accountsData = JSON.parse(
    fs.readFileSync("accountsData.json", "utf8")
);

class BankAccount {
    constructor(name, accountNumber, balance, is_active) {
        this.name = name;
        this.accountNumber = accountNumber;
        this.balance = balance >= 0 ? balance : 0;
        this.is_active = is_active;

        if (balance < 0) {
            console.log(
                `Invalid balance for ${name}. Balance set to 0.`
            );
        }
    }

    creditAmount(amount) {
        if (!this.is_active) {
            console.log(
                `Transaction failed. Account ${this.accountNumber} is inactive.`
            );
            return;
        }

        if (amount <= 0) {
            console.log("Credit amount must be greater than zero.");
            return;
        }

        this.balance += amount;
        console.log(
            `₦${amount} credited to ${this.name}. New balance: ₦${this.balance}`
        );
    }

    debitAmount(amount) {
        if (!this.is_active) {
            console.log(
                `Transaction failed. Account ${this.accountNumber} is inactive.`
            );
            return;
        }

        if (amount <= 0) {
            console.log("Debit amount must be greater than zero.");
            return;
        }

        if (amount > this.balance) {
            console.log("Debit amount exceeds account balance.");
            return;
        }

        this.balance -= amount;
        console.log(
            `₦${amount} debited from ${this.name}. New balance: ₦${this.balance}`
        );
    }

    transfer(recipient, amount) {
        // Checking if account is of active status
        if (!this.is_active) {
            console.log("Sender account is inactive.");
            return;
        }

        if (!recipient.is_active) {
            console.log("Recipient account is inactive.");
            return;
        }

        // Self transfer validation
        if (this.accountNumber === recipient.accountNumber) {
            console.log("Self-transfer is not allowed.");
            return;
        }

        // Validating Amount
        if (amount <= 0) {
            console.log("Transfer amount must be greater than zero.");
            return;
        }

        // Validating Balance
        if (amount > this.balance) {
            console.log("Insufficient funds.");
            return;
        }

        this.balance -= amount;
        recipient.balance += amount;

        console.log(
            `₦${amount} transferred from ${this.name} to ${recipient.name}`
        );
    }

    getBalance() {
        return this.balance;
    }
}

// Converting JSON accounts to objects
const bankAccounts = accountsData.map(
    account =>
        new BankAccount(
            account.name,
            account.accountNumber,
            account.balance,
            account.is_active
        )
);

// Helper function
function findAccount(accountNumber) {
    return bankAccounts.find(
        account => account.accountNumber === accountNumber
    );
}

// Testing Accounts
const samuel = findAccount("1001");
const kemi = findAccount("1002");
const nicholas = findAccount("1003");
const ebun = findAccount("1004");

console.log("\n--- Credit Test ---");
samuel.creditAmount(2000);

console.log("\n--- Debit Test ---");
samuel.debitAmount(1000);

console.log("\n--- Successful Transfer ---");
samuel.transfer(kemi, 1500);

console.log("\n--- Self Transfer ---");
samuel.transfer(samuel, 500);

console.log("\n--- Transfer To Inactive Account ---");
samuel.transfer(nicholas, 500);

console.log("\n--- Inactive Account Debit ---");
nicholas.debitAmount(500);

