
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bank');

var Transaction = require('./transaction');
var BankAccount = require('./bankAccount');

//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'Could not connect to database bank!'));
//db.once('open', function (callback) {
  


//});

var myAccount = new BankAccount({
	owner: "John Doe",
	accountNumber: "1233-4564-4564-5555",
	createdOn: new Date(2014,3,11),
	currency: "USD",
	balance: 1223.50
});

myAccount.displayInfo();