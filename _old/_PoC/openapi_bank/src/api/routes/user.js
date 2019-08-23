const express = require('express');
const user = require('../services/user');

const router = new express.Router();


/**
 * Alta de un usuario con credenciales de login validas
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await user.createUser(options);
    res.status(200).send(result.data);
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
  const options = {
    username: req.query['username'],
    password: req.query['password']
  };

  try {
    const result = await user.loginUser(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Logout del usuario del sistema
 */
router.get('/logout', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await user.logoutUser(options);
    res.status(200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
