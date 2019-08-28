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
 * @param {Object} options
 * @param {String} options.username username
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getAccountByUsername = async (options) => {

  console.log(`getAccountByUsername(${options}) `)

  var username = options.username;

  // Paso 1: Usuario es obligatorio
  if (!username) {
    return {
      status: 400,
      data: `User "username" no pueden ser nulo`
    };
  }

  // Paso 2: Chequea que el usuario exista
  var userList = await UserModel
                    .find({ 'username' : username }, 'userId username isLogged')
                    .exec();

  console.log(`existe usuario (${username}) rta = ${JSON.stringify(userList)}`);

  if (userList.length === 0) {
    return {
      status: 404,
      data: `User "${username}" not found.`
    };
  }

  // Paso 3: Recupera el userId
  var user = userList[0]

  // Paso 4: Recupero la lista de cuentas / productos
  var accountList = await AccountModel
                    .find({ 'userId' : user.userId }, {})
                    .exec();

  console.log(`productos (${user.userId}) rta = ${JSON.stringify(accountList)}`);

  if (accountList.length === 0) {
    return {
      status: 404,
      data: `Productos para "${user.userId}" not found.`
    };
  }

  return {
    status: 200,
    data: accountList
  };
};


/**
 * @param {Object} user
  * @throws {Error}
 * @return {Promise}
 */
module.exports.createProductsForUser = async (user) => {

  console.log(`createAccountForUser(${JSON.stringify(user)})`);

  var accountId_ca        = user.userId;        // user.userId es 4 digitos
  var accountId_cc        = user.userId + 1;
  var accountId_ca_usd    = user.userId + 2;
  var tarjetaId_tj_visa   = user.userId + 3;
  var tarjetaId_tj_master = user.userId + 4;

  var tarjetaId_tj_visa_number   = "6104 0000 2222 " + tarjetaId_tj_visa;
  var tarjetaId_tj_master_number = "8802 0000 4321 " + tarjetaId_tj_master;

  var account_ca = {
    userId             : user.userId,
    accountId          : accountId_ca,
    accountType        : CONST.CUENTA_TYPE_CA,
    accountBranch      : "118",
    accountNumber      : accountId_ca,
    accountDV          : 1,
    accountCurrency    : CONST.CUENTA_CURRENCY_ARS,
    accountBalance     : 100
  };

  var account_cc = {
    userId             : user.userId,
    accountId          : CONST.CUENTA_TYPE_CC,
    accountType        : "CC",
    accountBranch      : "118",
    accountNumber      : accountId_cc,
    accountDV          : 2,
    accountCurrency    : CONST.CUENTA_CURRENCY_ARS,
    accountBalance     : 0
  };

  var account_ca_usd = {
    userId             : user.userId,
    accountId          : CONST.CUENTA_TYPE_CA,
    accountType        : "CC",
    accountBranch      : "118",
    accountNumber      : accountId_ca_usd,
    accountDV          : 3,
    accountCurrency    : CONST.CUENTA_CURRENCY_USD,
    accountBalance     : 0
  };

  var tarjeta_tj_visa = {
    userId             : user.userId,
    accountId          : tarjetaId_tj_visa_number,
    accountType        : CONST.CUENTA_TYPE_TJ_VISA,
    accountBranch      : '',
    accountNumber      : tarjetaId_tj_visa_number,
    accountDV          : '',
    accountCurrency    : '',
    accountBalance     : 0
  };

  var tarjeta_tj_master = {
    userId             : user.userId,
    accountId          : tarjetaId_tj_master_number,
    accountType        : CONST.CUENTA_TYPE_TJ_MASTER,
    accountBranch      : '',
    accountNumber      : tarjetaId_tj_master_number,
    accountDV          : '',
    accountCurrency    : '',
    accountBalance     : 0
  };

  var arrProductos = [
    account_ca,
    account_cc,
    account_ca_usd,
    tarjeta_tj_visa,
    tarjeta_tj_master
  ];

  var Account = new AccountModel();


  Account.collection.insert(arrProductos, (err, docs) => {
    if (err){
      return console.error(err);
    } else {
      console.log("Multiple documents inserted to Collection");
    }
  })

  let message = `Productos creados el usuario (id=${user.userId}) ${user.username}:
    ${CONST.CUENTA_TYPE_CA_desc} ${account_ca.accountNumber},
    ${CONST.CUENTA_TYPE_CC_desc} ${account_cc.accountNumber},
    ${CONST.CUENTA_TYPE_CA_USD_desc} ${account_ca_usd.accountNumber},
    ${CONST.CUENTA_TYPE_TJ_VISA} ${tarjeta_tj_visa.accountNumber},
    ${CONST.CUENTA_TYPE_TJ_MASTER} ${tarjeta_tj_master.accountNumber},
  `

  console.log("Message ", message);

  return {
    status: 201,
    data: {
      message: message,
      productos: arrProductos
    }
  };
};
