const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('../lib/config');
const logger = require('../lib/logger');

const log = logger(config.logger);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


/*
 * Seguridad de Acceso
 */
var security = require('./security/validate')

// app.use('/user',        security.jwtCheck, security.requireScope('full_access'));
app.use('/account',     security.jwtCheck, security.requireScope('full_access'));
app.use('/product',     security.jwtCheck, security.requireScope('full_access'));
app.use('/transaction', security.jwtCheck, security.requireScope('full_access'));
app.use('/quote',       security.jwtCheck, security.requireScope('full_access'));




/*
 * Routes
 */
app.use('/user', require('./routes/user'));
app.use('/account', require('./routes/account'));
app.use('/product', require('./routes/product'));
app.use('/transaction', require('./routes/transaction'));
app.use('/quote', require('./routes/quote'));

// catch 404
app.use((req, res, next) => {
  log.error(`Error 404 on ${req.url}.`);
  res.status(404).send({ status: 404, error: 'Not found' });
});

// catch errors
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.error || err.message;
  log.error(`Error ${status} (${msg}) on ${req.method} ${req.url} with payload ${req.body}.`);
  res.status(status).send({ status, error: msg });
});


module.exports = app;
