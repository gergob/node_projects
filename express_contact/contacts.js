var MongoClient = require("mongodb").MongoClient;

var DATABASE = "contacts";
var CONNECTION_STRING = "mongodb://localhost:27017/" + DATABASE;

var contacts = {

	getAllContacts : function (callback) {

		MongoClient.connect(CONNECTION_STRING, function(error, database){
			var local_error = error;
			var data = [];
			if(local_error) {
				console.log(local_error);
				if(callback){
					callback(local_error);
				}
			}

			console.log("Connected to DB (" + DATABASE + ")");
			
			var contactsCollection = database.collection("contacts");

			if(contactsCollection) {
				console.log("Querying contacts.");
				contactsCollection.find({}).toArray(function(err, documents){
					console.log("There were " + documents.length + " contacts loaded from collection.");
					if(callback){
						callback(local_error, documents);
					}
				}); 				
			}
			else {
				local_error = "Collection could not be loaded";
			}

			if(local_error) {
				callback(local_error);
			}

		});

	}
};

module.exports = contacts;