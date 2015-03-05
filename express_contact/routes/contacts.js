var express = require('express');
var router = express.Router();
var contacts = require('../contacts');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var tmpVar = "Express Contacts";
  console.log("Default contact page, query param is");
  console.log(req.query);
  contacts.getAllContacts(function(error, data){

  	if(error) {
  		res.render('contacts', { title: "Error" , welcom_message: error });
  	}
  	else if(data) {
      console.log("data recieved, rendering page");
      res.render('contacts', {title:"All Contacts", welcom_message: "Custom Angular Directives!", contacts:data })
  	}
  	else {
  		res.render('contacts', { title: "Error" , welcom_message: "No meaningful response from the server:" + req.originalUrl });	
  	}
  });
});

router.get('/template/contactCard', function(req, res, next) {
  res.render('contactCard');
});


router.get('/:name', function(req, res) {
  	contacts.getContactsByName(req.params.name, function(error, data) {
  		if(error) {
  			res.render('error', { message : error });
  		}
      var tmpResult = [];
      if(Object.keys(req.query).length > 0) {
          console.log(req.query);
          data.forEach(function(item){
            var tmpObj = {};
            for(var key in req.query) {
              if(item.hasOwnProperty(key)) {
                tmpObj[key] = item[key];
              }
            }
            tmpResult.push(tmpObj);
          });
      }
      else {
        data.forEach(function(item){          
          tmpResult.push(item);
        });
      }

  		res.status(200).json(tmpResult);
  	});
});

router.get('/:name/:property', function(req, res) {
  	logArrayData("REQUEST_PARAM:",req.params);
  	var property = req.params.property;
  	contacts.getContactsByName(req.params.name, function(error, data) {
  		if(error) {
  			res.render('error', { message : error });
  		}
  		var retData = [];
  		data.forEach(function(item){
  			var tmpObj = {};
  			tmpObj[property] = item[property];  			
  			retData.push(tmpObj);
  		});
  		res.status(200).json(retData);
  	});
});



function logArrayData (prefix, data) {
	for (var key in data) {
		console.log(prefix + key);
	}	
}

module.exports = router;
