var mongoose = require('mongoose').set('debug', true)

//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({

  userId     : Number,
  username   : String,
  password   : String,
  firstName  : String,
  lastName   : String,
  isLogged   : Boolean

});

var TransactionSchema = new Schema({

  transactionId       : Number,
  userId              : Number,
  accountId           : Number,
  transactionCurrency : String,
  transactionBalance  : Number,
  timestamp           : Date

});

var ProductSchema = new Schema({

  productId            : Number,
  productCode          : String,
  productDescription   : String,
  productLabel         : String,
  productCurrency      : String,
  productAmount        : Number

});

var AccountSchema = new Schema({

  userId             : Number,
  accountId          : Number,
  accountType        : String,
  accountBranch      : String,
  accountNumber      : String,
  accountDV          : String,
  accountCurrency    : String,
  accountBalance     : Number

});


var UserModel         = mongoose.model('users',         UserSchema );
var TransactiontModel = mongoose.model('transactionts', TransactionSchema );
var ProductModel      = mongoose.model('products',      ProductSchema );
var AccountModel      = mongoose.model('accounts',      AccountSchema );




// Enable CRUD Operation

module.exports.UserModel         = UserModel
module.exports.TransactiontModel = TransactiontModel
module.exports.ProductModel      = ProductModel
module.exports.AccountModel      = AccountModel


