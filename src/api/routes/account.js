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

module.exports = router;
