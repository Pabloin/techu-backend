const ServerError = require('../../lib/error');
var AccountModel = require('../core/db.models').AccountModel

const CONST = require('../core/Const');
const CORE_DB = require('../core/db.test');

/**
 * @param {Object} options
 * @param {Integer} options.accountId Id de la cuenta
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getAccount = async (options) => {

  console.log('getAccount()')

  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  CORE_DB.testDatabaseModel()

  return {
    status: 200,
    data: 'getAccount v2 ok!'
  };
};

/**
 * @param {Object} user
  * @throws {Error}
 * @return {Promise}
 */
module.exports.createAccountForUser = async (user) => {

  console.log(`createAccountForUser(${JSON.stringify(user)})`);

  var accountId_ca        = userId;        // userId es 4 digitos
  var accountId_cc        = userId + 1;
  var accountId_ca_usd    = userId + 2;
  var tarjetaId_tj_visa   = userId + 3;
  var tarjetaId_tj_master = userId + 4;

  var tarjetaId_tj_visa_number   = "6104 0000 2222 " + tarjetaId_tj_visa;
  var tarjetaId_tj_master_number = "8802 0000 4321 " + tarjetaId_tj_master;

  var account_ca = new AccountModel({
    userId             : user.userId,
    accountId          : accountId_ca,
    accountType        : CONST.CUENTA_TYPE_CA,
    accountBranch      : "118",
    accountNumber      : accountId_ca,
    accountDV          : 1,
    accountCurrency    : CONST.CUENTA_CURRENCY_ARS,
    accountBalance     : 100
  });

  var account_cc = new AccountModel({
    userId             : user.userId,
    accountId          : CONST.CUENTA_TYPE_CC,
    accountType        : "CC",
    accountBranch      : "118",
    accountNumber      : accountId_cc,
    accountDV          : 2,
    accountCurrency    : CONST.CUENTA_CURRENCY_ARS,
    accountBalance     : 0
  });

  var account_ca_usd = new AccountModel({
    userId             : user.userId,
    accountId          : CONST.CUENTA_TYPE_CA,
    accountType        : "CC",
    accountBranch      : "118",
    accountNumber      : accountId_ca_usd,
    accountDV          : 3,
    accountCurrency    : CONST.CUENTA_CURRENCY_USD,
    accountBalance     : 0
  });

  var tarjeta_tj_visa = new AccountModel({
    userId             : user.userId,
    accountId          : tarjetaId_tj_visa_number,
    accountType        : CONST.CUENTA_TYPE_TJ_VISA,
    accountBranch      : '',
    accountNumber      : tarjetaId_tj_visa_number,
    accountDV          : '',
    accountCurrency    : '',
    accountBalance     : 0
  });

  var tarjeta_tj_master = new AccountModel({
    userId             : user.userId,
    accountId          : tarjetaId_tj_master_number,
    accountType        : CONST.CUENTA_TYPE_TJ_MASTER,
    accountBranch      : '',
    accountNumber      : tarjetaId_tj_master_number,
    accountDV          : '',
    accountCurrency    : '',
    accountBalance     : 0
  });


  account_ca.save((err) => {
    if (err) return handleError(err);
  })

  account_cc.save((err) => {
    if (err) return handleError(err);
  })

  account_ca_usd.save((err) => {
    if (err) return handleError(err);
  })

  tarjeta_tj_visa.save((err) => {
    if (err) return handleError(err);
  })

  tarjeta_tj_master.save((err) => {
    if (err) return handleError(err);
  })

  return {
    status: 201,
    data: `Productos creados el usuario (id=${user.userId}) ${user.username}:
            ${CONST.CUENTA_TYPE_CA_desc} ${account_ca.accountNumber},
            ${CONST.CUENTA_TYPE_CC_desc} ${account_cc.accountNumber},
            ${CONST.CUENTA_TYPE_CA_USD_desc} ${account_ca_usd.accountNumber},
            ${CONST.CUENTA_TYPE_TJ_VISA} ${tarjeta_tj_visa.accountNumber},
            ${CONST.CUENTA_TYPE_TJ_MASTER} ${tarjeta_tj_master.accountNumber},
           `
  };
};
