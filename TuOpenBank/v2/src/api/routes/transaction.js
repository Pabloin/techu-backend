const express = require('express');
const transaction = require('../services/transaction');

const router = new express.Router();


/**
 * Retorna la lista de transacciones de una usuario
 */
router.get('/:userId', async (req, res, next) => {
  const options = {
    userId: req.params['userId']
  };

  try {
    const result = await transaction.getTransaction(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
