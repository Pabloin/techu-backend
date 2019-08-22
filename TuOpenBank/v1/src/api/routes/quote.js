const express = require('express');
const quote = require('../services/quote');

const router = new express.Router();


/**
 * Retorna un mensaje random para el usuario
 */
router.get('/:quoteId', async (req, res, next) => {
  const options = {
    quoteId: req.params['quoteId']
  };

  try {
    const result = await quote.getQuote(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Retorna un mensaje random para el usuario
 */
router.get('/protected/:quoteId', async (req, res, next) => {
  const options = {
    quoteId: req.params['quoteId']
  };

  try {
    const result = await quote.getProtectedQuote(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
