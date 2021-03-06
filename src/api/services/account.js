const ServerError = require('../../lib/error')
const Common = require('../core/Common')
const CONST = require('../core/Const').Const
const Code = require('../core/Const').Code
const CORE_DB = require('../core/db.test')
const AccountModel = require('../core/db.models').AccountModel
const TransactiontModel = require('../core/db.models').TransactiontModel
const UserModel = require('../core/db.models').UserModel

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
    status: Code.HTTP_200_OK,
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
      status: Code.HTTP_400_BAD_REQUEST,
      error: `User "username" no pueden ser nulo`
    };
  }

  // Paso 2: Chequea que el usuario exista
  var userList = await UserModel
                    .find({ 'username' : username }, 'userId username isLogged')
                    .exec();

  console.log(`existe usuario (${username}) rta = ${JSON.stringify(userList)}`);

  if (userList.length === 0) {
    return {
      status: Code.HTTP_404_NOT_FOUND,
      error: `User "${username}" not found.`
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
      status: Code.HTTP_404_NOT_FOUND,
      error: `Productos para "${user.userId}" not found.`
    };
  }

  return {
    status: Code.HTTP_200_OK,
    data: accountList
  };
};

simulaImporteAcreditacioSueldoInical = () => {
  // Sueldo Inicial: $ 10.000 +- 30%
  return 10000 + Common.numeroAleatorio(-3000, 3000)
}

simulaConsumoTarjeta = (sueldo, porcentaje) => {

  let gasto = (presupuesto, porcentaje) => Number.parseFloat(presupuesto * porcentaje).toFixed(2);

                // -- Cada columna vertical suma 100%, es decir 1
  let percentR1 = [ 0.40, 0.30, 0.20, 0.10, 0.30, 0.15, 0.10, 0.22, 0.40, 0.21 ]
  let percentR2 = [ 0.25, 0.20, 0.25, 0.40, 0.20, 0.34, 0.15, 0.44, 0.24, 0.29 ]
  let percentR3 = [ 0.15, 0.25, 0.15, 0.15, 0.25, 0.16, 0.35, 0.06, 0.16, 0.16 ]
  let percentR4 = [ 0.12, 0.10, 0.15, 0.15, 0.10, 0.25, 0.20, 0.15, 0.08, 0.08 ]
  let percentR5 = [ 0.08, 0.15, 0.25, 0.20, 0.15, 0.10, 0.20, 0.15, 0.12, 0.36 ]

  let idx = Common.numeroAleatorio(0, 9)

  let presupuestoTotal = gasto(sueldo, porcentaje);

  let accountStatus  = {
    tarjetaTotal            : presupuestoTotal,
    tarjetaRubroViajes      : gasto(presupuestoTotal, percentR1[idx] ),
    tarjetaRubroRopa        : gasto(presupuestoTotal, percentR2[idx] ),
    tarjetaRubroDiversion   : gasto(presupuestoTotal, percentR3[idx] ),
    tarjetaRubroComida      : gasto(presupuestoTotal, percentR4[idx] ),
    tarjetaOtros            : gasto(presupuestoTotal, percentR5[idx] ),
  }

  return accountStatus
}


/**
 * @param {Object} user
  * @throws {Error}
 * @return {Promise}
 */
module.exports.createProductsForUser = async (user) => {

  console.log(`createAccountForUser(${JSON.stringify(user)})`);

  var accountId_ca        = user.userId + 1;        // user.userId es 4 digitos
  var accountId_cc        = user.userId + 2;
  var accountId_ca_usd    = user.userId + 3;
  var tarjetaId_tj_visa   = user.userId + 4;
  var tarjetaId_tj_master = user.userId + 5;

  var tarjetaId_tj_visa_number   = "6104 0000 2222 " + tarjetaId_tj_visa;
  var tarjetaId_tj_master_number = "8802 0000 4321 " + tarjetaId_tj_master;

  var sueldoSaldoInicial = simulaImporteAcreditacioSueldoInical()
  var simulaConsumoTarjetaVisa = simulaConsumoTarjeta(sueldoSaldoInicial, 0.6);
  var simulaConsumoTarjetaMaster = simulaConsumoTarjeta(sueldoSaldoInicial, 0.2);

  var account_ca = {
    userId             : user.userId,
    accountId          : accountId_ca,
    accountType        : CONST.CUENTA_TYPE_CA,
    accountBranch      : "118",
    accountNumber      : accountId_ca,
    accountDV          : 1,
    accountCurrency    : CONST.CUENTA_CURRENCY_ARS,
    accountBalance     : sueldoSaldoInicial,
    accountStatus      : {
      cajaAhorroActiva: true
    }
  };

  var account_cc = {
    userId             : user.userId,
    accountId          : accountId_cc,
    accountType        : CONST.CUENTA_TYPE_CC,
    accountBranch      : "118",
    accountNumber      : accountId_cc,
    accountDV          : 2,
    accountCurrency    : CONST.CUENTA_CURRENCY_ARS,
    accountBalance     : 0,
    accountStatus      : {
      cuentaCorrienteLimite: 5000
    }
  };

  var account_ca_usd = {
    userId             : user.userId,
    accountId          : accountId_ca_usd,
    accountType        : CONST.CUENTA_TYPE_CA,
    accountBranch      : "118",
    accountNumber      : accountId_ca_usd,
    accountDV          : 3,
    accountCurrency    : CONST.CUENTA_CURRENCY_USD,
    accountBalance     : 0,
    accountStatus      : {
      cajaAhorroActiva: true
    }
  };

  var tarjeta_tj_visa = {
    userId             : user.userId,
    accountId          : tarjetaId_tj_visa_number,
    accountType        : CONST.CUENTA_TYPE_TJ_VISA,
    accountBranch      : '',
    accountNumber      : tarjetaId_tj_visa_number,
    accountDV          : '',
    accountCurrency    : '',
    accountBalance     : simulaConsumoTarjetaVisa.tarjetaTotal,
    accountStatus      : simulaConsumoTarjetaVisa
  };

  var tarjeta_tj_master = {
    userId             : user.userId,
    accountId          : tarjetaId_tj_master_number,
    accountType        : CONST.CUENTA_TYPE_TJ_MASTER,
    accountBranch      : '',
    accountNumber      : tarjetaId_tj_master_number,
    accountDV          : '',
    accountCurrency    : '',
    accountBalance     : simulaConsumoTarjetaMaster.tarjetaTotal,
    accountStatus      : simulaConsumoTarjetaMaster
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

  var now = new Date();

  var transaction = new TransactiontModel({
    userId                  : user.userId,
    accountId               : account_ca.accountId,
    transactionDate         : now,
    transactionCurrency     : CONST.CUENTA_CURRENCY_ARS,
    transactionDescription  : CONST.MOV_TIPO_HABERES,
    transactionBalance      : sueldoSaldoInicial,
    timestamp               : now
  });

  transaction.save((err) => {
    if (err) return handleError(err);
  })


  // Crear movimiento inicial de Acreditacion de Sueldo en la CA


  let message = `Productos creados el usuario (id=${user.userId}) ${user.username}:
    ${CONST.CUENTA_TYPE_CA_desc} ${account_ca.accountNumber},
    ${CONST.CUENTA_TYPE_CC_desc} ${account_cc.accountNumber},
    ${CONST.CUENTA_TYPE_CA_USD_desc} ${account_ca_usd.accountNumber},
    ${CONST.CUENTA_TYPE_TJ_VISA} ${tarjeta_tj_visa.accountNumber},
    ${CONST.CUENTA_TYPE_TJ_MASTER} ${tarjeta_tj_master.accountNumber}, 
    y se simula la acredicion de un haber de ARS ${sueldoSaldoInicial}
  `

  console.log("Message ", message);

  return {
    status: Code.HTTP_201_CREATED_OK,
    data: {
      message: message,
      productos: arrProductos
    }
  };
};
