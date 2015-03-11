
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bank');

var Transaction = require('./transaction').Transaction;
var BankAccount = require('./bankAccount');

var transaction1 = new Transaction({
	transactionId: "IDGGFFG4579",
	from : "3122-4456-4444-5546",
	to: "1233-4564-4564-5555",
	fromOwner : "Jane Doe",
	toOwner: "John Doe",
	currency: "USD",
	value: 40.30,
	createdOn: new Date(2014,3,11,10,25,23),
	executedOn: new Date(2014,3,11,14,0,0),
	wasExecuted: true
});

var transaction2 = new Transaction({
	transactionId: "IDABCDF1233",
	from : "8877-4111-4999-5555",
	to: "1233-4564-4564-5555",
	fromOwner : "Bob Doe",
	toOwner: "John Doe",
	currency: "USD",
	value: 148.49,
	createdOn: new Date(2014,3,10,7,11,5),
	executedOn: null,
	wasExecuted: false
});

var myAccount = new BankAccount({
	owner: "John Doe",
	accountNumber: "1233-4564-4564-5555",
	createdOn: new Date(2014,3,11),
	currency: "USD",
	balance: 2864.53,
	transactions: [
		transaction1,
		transaction2
	]
});

//myAccount.displayInfo();

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Could not connect to database bank!'));
db.once('open', function (callback) {
	console.log("Connection to the db created.");
});

myAccount.save(function(err, account, numberOfItemsAffrected){
	if(err) {
		console.log(err);
		return;
	}
	if(account) {
		console.log("Number of items affected in the database:" + numberOfItemsAffrected);
		account.displayInfo();
	}
});

