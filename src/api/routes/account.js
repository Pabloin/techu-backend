const express = require('express');
const account = require('../services/account');
const Common = require('../core/Common');
const router = new express.Router();


/**
 * Retorna la informacion de una cuenta
 */
router.get('/:accountId', async (req, res, next) => {

  const options = {
    accountId: req.params['accountId']
  };

  console.log(`router.get /:accountId ${options.accountId}`);

  try {
    const result = await account.getAccount(options);
    res.status(result.status).send(Common.getResultData(result));
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Retorna lista de cuentas / producto por usuario
 */
router.get('/user/:username', async (req, res, next) => {

  const options = {
    username: req.params['username']
  };

  console.log(`v2 router.get /user/:usernam ${options.username}`);

  try {
    const result = await account.getAccountByUsername(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
