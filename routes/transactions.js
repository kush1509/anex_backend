var express = require('express');
var router = express.Router();
var sequelize = require('sequelize');
var Transaction = require('../models').Transaction;
var User = require('../models').User;

/*POST transaction details*/
router.post('/addTransaction', function(req, res) {
	var typeOfTransaction = req.body.typeOfTransaction;
	var date = req.body.date;
	var amount = req.body.amount;
	var nameOfParty = req.body.nameOfParty;
	var summary = req.body.summary;
	var modeOfPayment = req.body.modeOfPayment;
	var uniqueId = req.body.uniqueId;

	//console.log(date);

	Transaction.create({
		typeOfTransaction: typeOfTransaction,
		date: date,
		amount: amount,
		nameOfParty: nameOfParty,
		summary: summary,
		modeOfPayment:modeOfPayment,
	}).then(function(transaction){
		User.find({
			where:{
				uniqueId: uniqueId
			}
		}).then(function(user){
			user.addTransaction(transaction);
			res.send("Transaction added");
		})
	}).catch(function(e){
		res.send("Transaction not added");
		console.log(e);
	})
	
});


router.get('/getTransactions/:uniqueId',function(req, res) {

	var uniqueId = req.params.uniqueId;
	console.log(uniqueId);

	Transaction.findAll({
		where: {
			userUniqueId: uniqueId,
		}
	}).then(function(transactions){
		res.send(transactions);
	}).catch(function(e){
		res.send("Failed");
		console.log(e);
	})

});


router.get('/getTransactionsByMonth/:uniqueId/:month',function(req, res) {

	const Op = sequelize.Op;
	var uniqueId = req.params.uniqueId;
	var month = req.params.month;
	//console.log(userID);

	User.find({
		where : {
			uniqueId : uniqueId
		}
	}).then( user => {
		user.getTransaction()
		.then(function(transactions){
			var arr = [];
			transactions.forEach(function(t){
				//console.log(t.date.getMonth());
				if(t.date.getMonth()+1 == month)
					arr.push(t);
			})


			res.send(arr.sort(function(a,b){
				return new Date(a.date)- new Date(b.date);
			}));
		}).catch(function(e){
			res.send("Failed");
			console.log(e);
		})
	});

});


module.exports = router;
