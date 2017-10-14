var express = require('express');
var router = express.Router();
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


/*router.get('/getTransactions/:userID/:month',function(req, res) {

	var userID = req.params.userID;
	var month = req.params.month;
	console.log(userID);

	Transaction.findAll({
		where: {
			userUniqueId: userID,
			sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
		}
	}).then(function(transactions){
		res.send(transactions);
	}).catch(function(e){
		res.send("Failed");
		console.log(e);
	})

});
*/

module.exports = router;