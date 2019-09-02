const ServerError = require('../../lib/error')
const Common = require('../core/Common')
const CONST = require('../core/Const')
const AccountModel = require('../core/db.models').AccountModel
const TransactiontModel = require('../core/db.models').TransactiontModel
const mongoose = require('mongoose').set('debug', true)

/**
 * @param {Object} options
 * @param {Integer} options.accountId accountId
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getTransactionList = async (options) => {

  var  fromAccount = await TransactiontModel.find({ 'accountId' : options.accountId }, {}).exec();

  return {
    status: 200,
    data:  fromAccount
  };
};


/**
 * @param {Object} options
 * @param {Integer} options.fromAccountId cuenta origen
 * @param {Integer} options.toAccountId cuenta destino
 * @param {Integer} options.importe importe
 * @throws {Error}
 * @return {Promise}
 */
module.exports.doTransferencia = async (options) => {
  
  console.log(`doTransferencia from ${JSON.stringify(options)}`);

  options.cotizacion = 0
  options.tipoOperacion = CONST.OP_TRANSFERENCIA;

  return await this.doExchange(options)
};


/**
 * @param {Object} options
 * @param {Integer} options.fromAccountId cuenta origen
 * @param {Integer} options.toAccountId cuenta destino
 * @param {Integer} options.importeEnUSD importe En USD
 * @param {Integer} options.cotizacion cotizacion del tipo de cambio en USD
 * @throws {Error}
 * @return {Promise}
 */
module.exports.doExchange = async (options) => {

  if (options.tipoOperacion === undefined) {
    options.tipoOperacion = CONST.OP_EXCHANGE
  }
  var  fromAccount = await AccountModel.findOne({ 'accountId' : options.fromAccountId }, {}).exec();
  var    toAccount = await AccountModel.findOne({ 'accountId' : options.toAccountId }, {}).exec();
  
  console.log(`Operacion ${options.tipoOperacion}: from ${JSON.stringify( fromAccount)} to  ${JSON.stringify(toAccount)}`);

  if ( fromAccount === null) {
    return {
      status: 404,
      data: `Cuenta origen ${options.fromAccountId} inexistente`
    };
  }
  
  if (toAccount === null) {
    return {
      status: 404,
      data: `Cuenta destino ${options.toAccountId} inexistente`
    };
  }

  var mismaMoneda = ( fromAccount.accountCurrency === toAccount.accountCurrency);


  console.log(`OPERACION: ${options.tipoOperacion}, Misma Moneda ${mismaMoneda}. `)
  if (!mismaMoneda) {
    if (options.tipoOperacion === CONST.OP_TRANSFERENCIA) {
      return {
        status: 400,
        data: `No se pueden realizar transferencias sobre cuentas de distinto Moneda.`
      };
    } 
  }

  if (mismaMoneda) {
    if (options.tipoOperacion === CONST.OP_EXCHANGE) {
      return {
        status: 400,
        data: `No se pueden realizar un Exchange sobre cuentas de la misma Moneda.`
      };
    } 
  }


  if ( fromAccount.accountType === CONST.CUENTA_TYPE_CA) {
    if ( fromAccount.accountCurrency === CONST.CUENTA_CURRENCY_ARS) {
      if ( fromAccount.accountBalance - options.importe < 0) {
        return {
          status: 400,
          data: `Saldo insuficiente en pesos`
        };
      }
    } else {
      if ( fromAccount.accountBalance - options.importe < 0) {
        return {
          status: 400,
          data: `Saldo insuficiente en dolares`
        };
      }
    }
  }

  atomicTransferencia = async (tipoOperacion, 
                                fromAccount, toAccount, 
                               importe, cotizacion) => {

    let fromAccountBalance = Number.parseFloat(fromAccount.accountBalance);
    let   toAccountBalance = Number.parseFloat(  toAccount.accountBalance);
                           
    let fromTransactionBalance = 0
    let   toTransactionBalance = 0

    isDolarCompra = (currencyOrigen) => currencyOrigen === CONST.CUENTA_CURRENCY_ARS
    isDolarVenta  = (currencyOrigen) => currencyOrigen === CONST.CUENTA_CURRENCY_USD

    if (options.tipoOperacion === CONST.OP_TRANSFERENCIA) {
           fromTransactionBalance = importe * -1;
             toTransactionBalance = importe;
    } else {
      // OPERACION TIPO EXCHANGE: El importe es en USD
      if (isDolarCompra(fromAccount.accountCurrency)) {
           fromTransactionBalance = importe * -1 * cotizacion;
             toTransactionBalance = importe;
      } else {
           fromTransactionBalance = importe * -1;
             toTransactionBalance = importe * cotizacion;
      }
    }

        fromAccountBalance += fromTransactionBalance;
          toAccountBalance +=   toTransactionBalance;

    console.log(`Operacion ${tipoOperacion}: 
                      FROM: [${fromAccount}  
                        TO: ${toAccount}
                   IMPORTE: ${importe}
                   fromTransactionBalance: ${fromTransactionBalance}
                   toTransactionBalance: ${toTransactionBalance}
                `)

    descTipoOp = (tipoOperacion) => (tipoOperacion == CONST.OP_TRANSFERENCIA) ? `Transferencia entre cuentas`
                                  : (isDolarCompra(fromAccount.accountCurrency)) ? `Compra de Dolares` 
                                  : (isDolarVenta(fromAccount.accountCurrency)) ? `Venta de Dolares` 
                                  : `Transaccion Monetaria` 

    var now = new Date();
    var movimientoDebito = new TransactiontModel({
      userId                  : fromAccount.userId,
      accountId               : fromAccount.accountId,
      transactionDate         : now,
      transactionCurrency     : fromAccount.accountCurrency,
      transactionDescription  : descTipoOp(tipoOperacion),
      transactionBalance      : fromTransactionBalance,
      timestamp               : now
    });

    var movimientoCredito = new TransactiontModel({
      userId                  : toAccount.userId,
      accountId               : toAccount.accountId,
      transactionDate         : now,
      transactionCurrency     : toAccount.accountCurrency,
      transactionDescription  : descTipoOp(tipoOperacion),
      transactionBalance      : toTransactionBalance,
      timestamp               : now
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

       fromAccount.accountBalance = fromAccountBalance
         toAccount.accountBalance = toAccountBalance

      await  fromAccount.save()
      await    toAccount.save()

      await movimientoDebito.save()
      await movimientoCredito.save()

      await session.commitTransaction();
      session.endSession();

    } catch (error) {

      await session.abortTransaction();
      session.endSession();

      return {
        status: 500,
        data: `No se pudo procesar la transferencia atomicamente.`
      };
    }
  }

  await atomicTransferencia(options.tipoOperacion,
                             fromAccount, toAccount,
                            Number.parseFloat(options.importe), 
                            Number.parseFloat(options.cotizacion))

  console.log(`Operacion ${options.tipoOperacion}: from ${JSON.stringify( fromAccount)} to  ${JSON.stringify(toAccount)}`);

  return {
    status: 200,
    data: `Operacion de ${options.tipoOperacion} OK`
  };
};

