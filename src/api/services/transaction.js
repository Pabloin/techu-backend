const ServerError = require('../../lib/error')
const Common = require('../core/Common')
const CONST = require('../core/Const')
const AccountModel = require('../core/db.models').AccountModel
const mongoose = require('mongoose').set('debug', true)

/**
 * @param {Object} options
 * @param {Integer} options.userId UserId
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getTransaction = async (options) => {
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

  return {
    status: 200,
    data: 'getTransaction ok!'
  };
};

/**
 * @param {Object} options
 * @param {Integer} options.fromAccountId cuenta origen
 * @param {Integer} options.toAccountId cuenta destino
 * @param {Integer} options.importe importe
 * @param {Integer} options.cotizacion cotizacion del tipo de cambio
 * @throws {Error}
 * @return {Promise}
 */
module.exports.doTransferencia = async (options) => {

  var fromtAccount = await AccountModel.findOne({ 'accountId' : options.fromAccountId }, {}).exec();
  var    toAccount = await AccountModel.findOne({ 'accountId' : options.toAccountId }, {}).exec();
  
  console.log(`doTransferencia from ${JSON.stringify(fromtAccount)} to  ${JSON.stringify(toAccount)}`);

  if (fromtAccount === null || toAccount === null) {
    return {
      status: 404,
      data: `Cuentas inexitentes`
    };
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
      if (fromtAccount.accountBalance - options.importe * cotizacion < 0) {
        return {
          status: 400,
          data: `Saldo insuficiente en dolares`
        };
      }
    }
  }

  atomicTransferencia = async (fromtAccount, toAccount, importe, cotizacion) => {

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

    console.log(`doTransferencia new: FROM ${fromtAccountBalance} TO ${toAccountBalance} `)

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

      fromtAccount.accountBalance = fromtAccountBalance
      toAccount.accountBalance = toAccountBalance
      await fromtAccount.save()
      await    toAccount.save()

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

  await atomicTransferencia(fromtAccount, toAccount,
                            Number.parseFloat(options.importe), 
                            Number.parseFloat(options.cotizacion))

  console.log(`doTransferencia Ok from ${JSON.stringify(fromtAccount)} to  ${JSON.stringify(toAccount)}`);

  return {
    status: 200,
    data: 'doTransferencia ok!'
  };
};

