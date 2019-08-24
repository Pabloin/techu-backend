const express = require('express');
const quote = require('../services/quote');
const Common = require('../core/Common');
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
    res.status(result.status).send(Common.getResultData(result));
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
