var express = require('express');
var router = express.Router();
var User =  require('../models').User;


/* GET users listing. */
router.post('/create', function(req, res, next) {

	var uniqueId  = req.body.uniqueId;
	var name = req.body.name;

	User.create({
		uniqueIdkey: "value",  uniqueId: uniqueId,
		name: name,
	}).then(function(){
		res.send("User created");
	}).catch(function(e){
		res.send("User not created");
		console.log(e);
	})

});


module.exports = router;
