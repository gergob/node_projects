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
					if(err) {
						local_error += "\n";
						local_error += err;
					}
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
	},
	getContactsByName: function(name, callback) {
		MongoClient.connect(CONNECTION_STRING, function(error, database){
			var contactsCollection = database.collection("contacts");
			if(contactsCollection) {
				console.log("Querying contact by name = " + name);
				contactsCollection.find({"first_name" : name})
						.toArray(function(err, documents){
							if(err) {
								local_error += "\n";
								local_error += err;
							}
							console.log("There were " + documents.length + " contacts loaded from collection.");
							if(callback){
								callback(error, documents);
							}
						});
			} 							
			else {
				local_error = "Collection could not be loaded";
			}
		});
	}

};

module.exports = contacts;