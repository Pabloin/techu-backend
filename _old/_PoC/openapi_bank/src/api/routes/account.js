const express = require('express');
const account = require('../services/account');

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
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
