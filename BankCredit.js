class BankAccount {
    constructor(initialBalance) {
        this.balance = initialBalance;
        if (this.balance >= 0) this.balance = initialBalance;
        else {this.balance = 0;
        console.log("Initial balance was invalid"); }
    }

    creditAmount(amount) {
        if (typeof amount !== 'number' || amount <= 0) {
            return console.log("Invalid amount. Please enter a positive number.");
        }
        this.balance += amount;
    }
    

    debitAmount(amount) {
        if (typeof amount !== 'number' || amount <= 0) {
            return console.log("Invalid amount. Please enter a positive number.");
        }
        if (this.balance >= amount) {
            this.balance -= amount;
        } else {
            return console.log("Debit amount exceeded account balance.");
        }
    }

    getBalance() {
            return this.balance;
          }
        
        }
    
    let s1 = new BankAccount(1000);
    s1.creditAmount("50");
    s1.debitAmount(30);
    console.log(s1.getBalance());
