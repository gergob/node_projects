var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
	from : String,
	to: String,
	fromOwner : String,
	toOwner: String,
	currency: String,
	value: Number,
	createdOn: Date,
	executedOn: Date
});

var Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;