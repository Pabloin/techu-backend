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

  var fromtAccount = await TransactiontModel.find({ 'accountId' : options.accountId }, {}).exec();

  return {
    status: 200,
    data: fromtAccount
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
  var fromtAccount = await AccountModel.findOne({ 'accountId' : options.fromAccountId }, {}).exec();
  var    toAccount = await AccountModel.findOne({ 'accountId' : options.toAccountId }, {}).exec();
  
  console.log(`Operacion ${options.tipoOperacion}: from ${JSON.stringify(fromtAccount)} to  ${JSON.stringify(toAccount)}`);

  if (fromtAccount === null) {
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

  var mismaMoneda = (fromtAccount.accountCurrency === toAccount.accountCurrency);


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


  if (fromtAccount.accountType === CONST.CUENTA_TYPE_CA) {
    if (fromtAccount.accountCurrency === CONST.CUENTA_CURRENCY_ARS) {
      if (fromtAccount.accountBalance - options.importe < 0) {
        return {
          status: 400,
          data: `Saldo insuficiente en pesos`
        };
      }
    } else {
      if (fromtAccount.accountBalance - options.importe < 0) {
        return {
          status: 400,
          data: `Saldo insuficiente en dolares`
        };
      }
    }
  }

  atomicTransferencia = async (tipoOperacion, 
                               fromtAccount, toAccount, 
                               importe, cotizacion) => {

    let fromtAccountBalance = Number.parseFloat(fromtAccount.accountBalance)
    let    toAccountBalance = Number.parseFloat(   toAccount.accountBalance)

    if (fromtAccount.accountCurrency === toAccount.accountCurrency) {
        fromtAccountBalance -= importe;
           toAccountBalance += importe;
    } else {
      if (fromtAccount.accountCurrency === CONST.CUENTA_CURRENCY_ARS) {
          fromtAccountBalance -= importe;
             toAccountBalance += importe / cotizacion;
      } else {
          fromtAccountBalance -= importe;
             toAccountBalance += importe * cotizacion;
      }
    }

    console.log(`Operacion ${tipoOperacion}: FROM ${fromtAccountBalance} TO ${toAccountBalance} `)

    descTipoOp = (tipoOperacion) => (tipoOperacion == CONST.OP_TRANSFERENCIA) 
                                  ? `Transferencia entre cuentas`
                                  : `Compra Venta Dólares`

    var now = new Date();
    var movimientoDebito = new TransactiontModel({
      userId                  : fromtAccount.userId,
      accountId               : fromtAccount.accountId,
      transactionDate         : now,
      transactionCurrency     : fromtAccount.accountCurrency,
      transactionDescription  : tipoOperacion,
      transactionBalance      : importe * -1,
      timestamp               : now
    });

    var movimientoCredito = new TransactiontModel({
      userId                  : toAccount.userId,
      accountId               : toAccount.accountId,
      transactionDate         : now,
      transactionCurrency     : toAccount.accountCurrency,
      transactionDescription  : tipoOperacion,
      transactionBalance      : importe,
      timestamp               : now
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

      fromtAccount.accountBalance = fromtAccountBalance
         toAccount.accountBalance = toAccountBalance

      await fromtAccount.save()
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
                            fromtAccount, toAccount,
                            Number.parseFloat(options.importe), 
                            Number.parseFloat(options.cotizacion))

  console.log(`Operacion ${options.tipoOperacion}: from ${JSON.stringify(fromtAccount)} to  ${JSON.stringify(toAccount)}`);

  return {
    status: 200,
    data: `Operacion de ${options.tipoOperacion} OK`
  };
};

