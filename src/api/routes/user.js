const express = require('express');
const user = require('../services/user');
const Common = require('../core/Common');
const Code = require('../core/Const').Code
const router = new express.Router();

/**
 * Lista de los usuarios del sistema.
 */
router.get('/', async (req, res, next) => {

  console.log('GET /users/ Lista Usuarios')

  const options = {
    body: req.body
  };

  try {
    const result = await user.getUsersList(options);
    res.status(200).send(result);
  } catch (err) {
    return res.status(Code.HTTP_500_SERVER_ERROR).send({
      status: Code.HTTP_500_SERVER_ERROR,
      error: 'Server Error'
    });
  }
});

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
    res.status(200).send(result);
  } catch (err) {
    return res.status(Code.HTTP_500_SERVER_ERROR).send({
      status: Code.HTTP_500_SERVER_ERROR,
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
    res.status(200).send(result);
  } catch (err) {
    return res.status(Code.HTTP_500_SERVER_ERROR).send({
      status: Code.HTTP_500_SERVER_ERROR,
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
    res.status(200).send(result);
  } catch (err) {
    return res.status(Code.HTTP_500_SERVER_ERROR).send({
      status: Code.HTTP_500_SERVER_ERROR,
      error: 'Server Error'
    });
  }
});


/**
 * Recupera la password de un usuario enviando el mail
 */
router.get('/recover', async (req, res, next) => {

  const options = {
    username: req.query['username'],
    email: req.query['email']
  };

  console.log(`/user/recover ${JSON.stringify(options)}`);

  try {
    const result = await user.recoverPassword(options);
    res.status(200).send(result);
  } catch (err) {
    return res.status(Code.HTTP_500_SERVER_ERROR).send({
      status: Code.HTTP_500_SERVER_ERROR,
      error: 'Server Error'
    });
  }
});


module.exports = router;
