var mongoose = require('mongoose');

var bankAccountSchema = mongoose.Schema({
	owner : String,
	accountNumber: String,
	currency: String,
	balance: Number,
	createdOn: Date,
	transactions: Array
});

bankAccountSchema.methods.displayInfo = function () {
	console.log("Owner:" + this.owner + " | AccountNumber:" + this.accountNumber + " | Balance:" + this.balance);
};

var BankAccount = mongoose.model('BankAccount', bankAccountSchema);



module.exports = BankAccount;
