var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
	transactionId: String,
	from : String,
	to: String,
	fromOwner : String,
	toOwner: String,
	currency: String,
	value: Number,
	createdOn: Date,
	executedOn: Date,
	wasExecuted: Boolean
});

var Transaction = mongoose.model('Transaction', transactionSchema);
var TransactionSchema = transactionSchema;

module.exports.Transaction = Transaction;
module.exports.TransactionSchema = TransactionSchema;