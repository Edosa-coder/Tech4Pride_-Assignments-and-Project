const fs = require("fs");

class BankAccount {
	constructor() {
		this.accounts = JSON.parse(fs.readFileSync("accountsData.json", "utf8"));
	}

	creditAmount(accountNumber, amount) {
		const account = this.accounts.find(
			(acc) => acc.account_number === accountNumber,
		);
		if (!account || !account.is_active) {
			console.log("account not found or inactive user");
			return;
		}

		amount = Number(amount);
		if (isNaN(amount) || amount <= 0) {
			console.log("Invalid amount.");
			return;
		}

		account.balance = account.balance + amount;
		fs.writeFileSync(
			"accountsData.json",
			JSON.stringify(this.accounts, null, 2),
			"utf8",
		);
	}

	debitAmount(accountNumber, amount) {
		const account = this.accounts.find(
			(acc) => acc.account_number === accountNumber,
		);
		if (!account || !account.is_active) {
			console.log("account not found or inactive user");
			return;
		}

		amount = Number(amount);
		if (isNaN(amount) || amount <= 0) {
			console.log("Invalid amount. Please enter a positive number.");
			return;
		}

		if (amount > account.balance) {
			console.log("Debit amount exceeds account balance.");
			return;
		}

		account.balance = account.balance - amount;
		fs.writeFileSync(
			"accountsData.json",
			JSON.stringify(this.accounts, null, 2),
			"utf8",
		);
	}

	transfer(sender, receiver, amount) {
		if (sender === receiver) {
			console.log("cannot send to your self");
			return;
		}
		const senderAccount = this.accounts.find(
			(acc) => acc.account_number === sender,
		);
		if (!senderAccount || !senderAccount.is_active) {
			console.log("account not found or inactive user");
			return;
		}

		const receiverAccount = this.accounts.find(
			(acc) => acc.account_number === receiver,
		);
		if (!receiverAccount || !receiverAccount.is_active) {
			console.log("account not found or inactive user");
			return;
		}

		amount = Number(amount);
		if (isNaN(amount) || amount <= 0) {
			console.log("Invalid amount. Please enter a positive number.");
			return;
		}

		if (amount > senderAccount.balance) {
			console.log("cannot transfer what you do not have");
			return;
		}

		receiverAccount.balance = receiverAccount.balance + amount;
		senderAccount.balance = senderAccount.balance - amount;
		fs.writeFileSync(
			"accountsData.json",
			JSON.stringify(this.accounts, null, 2),
			"utf8",
		);
	}

	getBalance(accountNumber) {
		const account = this.accounts.find(
			(acc) => acc.account_number === accountNumber,
		);
		if (!account || !account.is_active) {
			console.log("account not found or inactive user");
			return;
		}

		return account;
	}
}

module.exports = BankAccount;