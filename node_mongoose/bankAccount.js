var mongoose = require('mongoose');
var transactionsSchema = require('./transaction').TransactionsSchema;

var bankAccountSchema = mongoose.Schema({
	owner : String,
	accountNumber: String,
	currency: String,
	balance: Number,
	createdOn: Date,
	transactions: [transactionsSchema]
});


bankAccountSchema.methods.displayInfo = function () {
	console.log("Owner:" + this.owner 
				+ " | AccountNumber:" + this.accountNumber 
				+ " | Balance:" + this.balance);
	//
	// Log Transactions if these exist
	//
	if(this.transactions && this.transactions.length > 0){
		this.transactions.forEach(function(item, index){
			console.log("TransactionId:" + item.transactionId 
				+ " | From:" + item.fromOwner
				+ " | To:" + item.toOwner
				+ " | Currency:" + item.currency
				+ " | Value:" + item.value
				+ " | Executed:" + item.wasExecuted);
		});
	}
};

var BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;
