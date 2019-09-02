const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
const config = require('../lib/config');
const logger = require('../lib/logger');





const log = logger(config.logger);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


/**
 * Static content: Swagger API Doc
 */
app.use('/swagger-editor', express.static(__dirname + '/../../swagger-editor'));
app.use('/swagger.yaml', express.static(__dirname + '/../../swagger.yaml'));
app.use('/', express.static(__dirname + '/../../swagger-editor'));

/**
 * Setup
 */
const Common = require('./core/Common');
const mongoose = require('mongoose').set('debug', true);

app.use(cors())

app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next()
});

try {

  // Current Path: process.cwd()
  const ENV_PATH = '.env'

  var ENV_CONFIG = require('dotenv').config({path: ENV_PATH })

  // if (process.env.Techu_RUNTIME_LIVE === "localhost") {
  //     console.log(`ENV_CONFIG: ${JSON.stringify(ENV_CONFIG)}`)
  // }

} catch(err) {
  console.error(err)
}


mongoose.connect(Common.getMongoConfig(), function(err, res) {
  if(err) {
      console.log('Error connecting to the database. ' + err);
  } else {
      console.log('Connected to Database ... ');
  }
});


/*
 * Seguridad de Acceso
 */
var secureScopeToken = require('./security/validate-scope-token')

app.get('/user',        secureScopeToken.jwtCheck, secureScopeToken.requireScope('full_access'));
app.use('/account',     secureScopeToken.jwtCheck, secureScopeToken.requireScope('full_access'));
app.use('/product',     secureScopeToken.jwtCheck, secureScopeToken.requireScope('full_access'));
app.use('/transaction', secureScopeToken.jwtCheck, secureScopeToken.requireScope('full_access'));
app.use('/quote',       secureScopeToken.jwtCheck, secureScopeToken.requireScope('full_access'));





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
