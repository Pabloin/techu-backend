var mongoose = require('mongoose').set('debug', true)

var UserSchema = mongoose.Schema({

  userId     : Number,
  username   : String,
  password   : String,
  firstName  : String,
  lastName   : String,
  isLogged   : Boolean

});

var TransactionSchema = mongoose.Schema({

  transactionId       : Number,
  userId              : Number,
  accountId           : Number,
  transactionCurrency : String,
  transactionBalance  : Number,
  timestamp           : Date

});

var ProductSchema = mongoose.Schema({

  productId            : Number,
  productCode          : String,
  productDescription   : String,
  productLabel         : String,
  productCurrency      : String,
  productAmount        : Number

});

var AccountSchema = mongoose.Schema({

  userId             : Number,
  accountId          : Number,
  accountType        : String,
  accountBranch      : String,
  accountNumber      : String,
  accountDV          : String,
  accountCurrency    : String,
  accountBalance     : Number

});

