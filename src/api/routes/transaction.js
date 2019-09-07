const express = require('express');
const transaction = require('../services/transaction');
const Common = require('../core/Common');
const Code = require('../core/Const').Code
const router = new express.Router();

/**
 * Retorna la lista de transacciones de una cuenta
 */
router.get('/:accountId', async (req, res, next) => {
  const options = {
    accountId: req.params['accountId']
  };

  try {
    const result = await transaction.getTransactionList(options);
    res.status(result.status).send(Common.getJsonResponse(result));
  } catch (err) {
    return res.status(Code.HTTP_500_SERVER_ERROR).send({
      status: Code.HTTP_500_SERVER_ERROR,
      error: 'Server Error'
    });
  }
});

/**
 * Realiza una transferencia desde el origen al destino, por 
 * importe
 */
router.post('/:fromAccountId', async (req, res, next) => {
  const options = {
    fromAccountId: req.params['fromAccountId'],
    toAccountId: req.body['toAccountId'],
    importe: req.body['importe']
  };

  try {
    const result = await transaction.doTransferencia(options);
    // res.status(result.status || 200).send(result.data);
    res.status(result.status).send(Common.getTextResponse(result));
  } catch (err) {
    return res.status(Code.HTTP_500_SERVER_ERROR).send({
      status: Code.HTTP_500_SERVER_ERROR,
      error: 'Server Error'
    });
  }
});


/**
 *  Realiza una Exchange desde el origen al destino, por 
 *  importe y tipo de cambio
 */
router.post('/exchange/:fromAccountId', async (req, res, next) => {
  const options = {
    fromAccountId: req.params['fromAccountId'],
    toAccountId: req.body['toAccountId'],
    importe: req.body['importeEnUSD'],
    cotizacion: req.body['cotizacion']
  };

  try {
    const result = await transaction.doExchange(options);
    // res.status(result.status || 200).send(result.data);
    res.status(result.status).send(Common.getTextResponse(result));
  } catch (err) {
    return res.status(Code.HTTP_500_SERVER_ERROR).send({
      status: Code.HTTP_500_SERVER_ERROR,
      error: 'Server Error'
    });
  }
});


module.exports = router;
