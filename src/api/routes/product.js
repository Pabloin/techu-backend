const express = require('express');
const product = require('../services/product');
const Common = require('../core/Common');
const Code = require('../core/Const').Code
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
    res.status(200).send(result);
  } catch (err) {
    return res.status(Code.HTTP_500_SERVER_ERROR).send({
      status: Code.HTTP_500_SERVER_ERROR,
      error: 'Server Error'
    });
  }
});

module.exports = router;
