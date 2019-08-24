const express = require('express');
const user = require('../services/user');
const Common = require('../core/Common');

const router = new express.Router();


/**
 * Alta de un usuario con credenciales de login validas
 */
router.post('/', async (req, res, next) => {

  console.log(`User POST queryString ${JSON.stringify(req.query)}`)
  console.log(`User POST x form body ${JSON.stringify(req.body)}`)

  const options = {
    body: req.body
  };

  try {
    const result = await user.createUser(options);
    res.status(result.status).send(Common.getResultData(result));
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Login del usuario en el sistema
 */
router.get('/login', async (req, res, next) => {

  console.log(`User LOGIN GET queryString ${JSON.stringify(req.query)}`)
  console.log(`User LOGIN GET x form body ${JSON.stringify(req.body)}`)

  const options = {
    username: req.query['username'],
    password: req.query['password']
  };

  console.log(`/user/login ${JSON.stringify(options)}`);

  try {
    const result = await user.loginUser(options);
    res.status(result.status).send(Common.getResultData(result));
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Logout del usuario del sistema
 */
router.get('/logout', async (req, res, next) => {

  const options = {
    username: req.query['username']
  };

  console.log(`/user/logout ${JSON.stringify(options)}`);

  try {
    const result = await user.logoutUser(options);
    res.status(result.status).send(Common.getResultData(result));
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
