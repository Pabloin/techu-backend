const express = require('express');
const account = require('../services/account');
const Common = require('../core/Common');
const Code = require('../core/Const').Code
const router = new express.Router();

/**
 * Retorna la informacion de una cuenta
 */
router.get('/:accountId', async (req, res, next) => {
  const options = {
    accountId: req.params['accountId']
  };

  try {
    const result = await account.getAccount(options);
    res.status(200).send(result);
  } catch (err) {
    return res.status(Code.HTTP_500_SERVER_ERROR).send({
      status: Code.HTTP_500_SERVER_ERROR,
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
    res.status(200).send(result);
  } catch (err) {
    return res.status(Code.HTTP_500_SERVER_ERROR).send({
      status: Code.HTTP_500_SERVER_ERROR,
      error: 'Server Error'
    });
  }
});

module.exports = router;
