var express = require('express');
var router = express.Router();
var contacts = require('../contacts');

/* GET home page. */
router.get('/', function(req, res, next) {
  var tmpVar = "Express";
  contacts.getAllContacts(function(error, data){
  	if(error) {
  		res.render('index', { title: "Error" , error_message: error });
  	}
  	else if(data) {
  		res.render('index', { title: tmpVar , contacts: data, error_message : "Contact Cards" });
  	}
  	else {
  		res.render('index', { title: "Error" , error_message: "No meaningful response from the server:" + req.originalUrl });	
  	}
  });
  
});

module.exports = router;
