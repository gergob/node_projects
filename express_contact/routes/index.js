var express = require('express');
var router = express.Router();
var contacts = require('../contacts');

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { 
  			title: "Express Demo",  
  			message : "Howdy Contact Cards Express APP ;)" 
  	});  
});

module.exports = router;
