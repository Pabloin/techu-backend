const express = require('express');
const product = require('../services/product');

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
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
