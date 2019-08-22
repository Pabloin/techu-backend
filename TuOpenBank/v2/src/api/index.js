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
var security = function (req, res, next) {
  console.log('security filter active .... ')
  next()
}
app.use('/user', security);
app.use('/account', security);
app.use('/product', security);
app.use('/transaction', security);

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
