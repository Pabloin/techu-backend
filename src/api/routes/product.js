const express = require('express');
const product = require('../services/product');
const Common = require('../core/Common');
const router = new express.Router();


/**
 * Retorna la informacion de un producto
 */
router.get('/:productId', async (req, res, next) => {
  const options = {
    productId: req.params['productId']
  };

  try {
    const result = await product.getProducts(options);
    res.status(result.status).send(Common.getJsonResponse(result));
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
