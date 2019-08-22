


module.exports.testDatabaseModel = () => {

  console.log('testDatabaseModel()');

  var UserModel         = require('./db.models').UserModel
  var TransactiontModel = require('./db.models').TransactiontModel
  var ProductModel      = require('./db.models').ProductModel
  var AccountModel      = require('./db.models').AccountModel

  var user = UserModel.find({ 'userId' : 1 })

  console.log(`testDatabaseModel() rta = ${JSON.stringify(user)}`);

  console.log(`testDatabaseModel() rta = `);
}
