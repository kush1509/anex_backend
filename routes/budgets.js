var express = require('express');
var router = express.Router();
var sequelize = require('sequelize');
var Transaction = require('../models').Transaction;
var User = require('../models').User;
var Budget = require('../models').Budget;

router.post('/addBudget', function(req,res){
	var uniqueId = req.body.uniqueId;
	var amount = req.body.amount;
	var month = req.body.month;

	Budget.findOne({
		where:{
				uniqueId:uniqueId,
				month: month,
			},
	
	}).then(function(budget){
		if(budget==null){
			Budget.create({
				uniqueId: uniqueId,
				amount: amount,
				month:month,

			}).then(function(){
					res.send("Budget added");
			}).catch(function(e){
				res.send("Budget not added");
				console.log(e);
			})

		}
	else{
			Budget.update({
				uniqueId: uniqueId,
				amount: amount,
				month:month,

				where:{
					userUniqueId:uniqueId,
					month:month,
				},

			
			}).then(function(){
					res.send("Budget added");
			}).catch(function(e){
				res.send("Budget not added");
				console.log(e);
			})
		}



	}).catch(function(e){
		console.log(e);
		res.send("Budget failed");
	})

	
});


router.get('/showBudget/:uniqueId/:month', function(req, res){
	var uniqueId = req.params.uniqueId;
	var month = req.params.month;

	Budget.findOne({
		where:{
				uniqueId:uniqueId,
				month:month,
			},
		
		
	}).then(function(budget){
		res.json({
			amount: budget.amount
		});
	}).catch(function(e){
		console.log(e);
		res.send("failed");
	})

});


router.get('/showBudgetSpent/:uniqueId/:month', function(req, res){
	var uniqueId = req.params.uniqueId;
	var month = req.params.month;
	//console.log(userID);

	var spent = 0;


	User.find({
		where : {
			uniqueId : uniqueId
		}
	}).then( user => {
		user.getTransaction()
		.then(function(transactions){
			transactions.forEach(function(t){
				if(t.date.getMonth()+1 == month)
					spent+=t.amount;

			})
		res.json({
			spent:spent
		});	
		})
		
		}).catch(function(e){
			res.send("Failed");
			console.log(e);
		})
	});	


router.get('/showBudgetLeft/:uniqueId/:month', function(req, res){
	var uniqueId = req.params.uniqueId;
	var month = req.params.month;
	//console.log(userID);

	var spent = 0;
	var budgetTotal = 0;


	User.find({
		where : {
			uniqueId : uniqueId
		}
	}).then( user => {
		user.getTransaction()
		.then(function(transactions){
			transactions.forEach(function(t){
				if(t.date.getMonth()+1 == month)
					spent+=t.amount;
			})

		Budget.findOne({
		where:{
				uniqueId:uniqueId,
				month:month
			},
		
		}).then(function(budget){
			budgetTotal = budget.amount;
			res.json({
				budgetLeft:budgetTotal-spent,
			})
		}).catch(function(e){
			console.log(e);
			res.send("failed1");
		})

		}).catch(function(e){
			res.send("Failed2");
			console.log(e);
		})
	});

	
});


module.exports = router;