const Sequelize = require('sequelize');

const sequelize = new Sequelize('anex', 'root', process.env.DATABASE_PASSWORD, {
  host: 'localhost',
  port: '3306',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const User = sequelize.define('user',{
  	name: { type: Sequelize.STRING, allowNull: false, defaultValue: ""},

  	uniqueId: { type: Sequelize.STRING, allowNull:false, defaultValue:"", primaryKey: true}
  })


  const Transaction = sequelize.define('transaction', {
  	//True= Expenditure
  	//False= Income
  	typeOfTransaction: { type:Sequelize.STRING, allowNull: false, defaultValue:"EXPENSE"},

  	date:{ type: Sequelize.DATE, allowNull: false},

  	amount:{ type: Sequelize.DOUBLE, allowNull:false, defaultValue:0},

  	nameOfParty: {type: Sequelize.STRING, allowNull:true},

  	summary: { type: Sequelize.STRING, allowNull:true},

  	modeOfPayment: { type: Sequelize.STRING, defaultValue:'CASH'}

  })

User.hasMany(Transaction, {as:'transaction'})
 //sequelize.sync();

module.exports.User = User;
module.exports.Transaction = Transaction;