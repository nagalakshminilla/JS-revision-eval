function createBankAccount() {
    let balance = 0;
    const transactions = [];
    
    // Private helper function to record transactions
    function recordTransaction(type, amount) {
        transactions.push({
            type,
            amount,
            balanceAfter: balance,
            timestamp: new Date().toISOString()
        });
    }
    return {
        deposit(amount) {
            // Input validation
            if (typeof amount !== 'number') {
                return "Error: Deposit amount must be a number";
            }
            if (amount <= 0) {
                return "Error: Deposit amount must be positive";
            }
            balance += amount;
            recordTransaction('deposit', amount);
            
            return `Success: Deposited $${amount}. Current balance: $${balance}`;
        },
        
        withdraw(amount) {
            // Input validation
            if (typeof amount !== 'number') {
                return "Error: Withdrawal amount must be a number";
            }
            if (amount <= 0) {
                return "Error: Withdrawal amount must be positive";
            }
            if (amount > balance) {
                return "Error: Insufficient funds";
            }
            balance -= amount;
            recordTransaction('withdraw', amount);
            
            return `Success: Withdrew $${amount}. Current balance: $${balance}`;
        },
        
        getBalance() {
            return balance;
        },
        
        getTransactionHistory() {
            // Return a copy to maintain privacy
            return transactions.map(t => ({...t}));
        }
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = createBankAccount;
}
