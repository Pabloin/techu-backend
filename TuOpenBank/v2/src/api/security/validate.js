var express = require('express');
var jwt     = require('express-jwt');
var config  = require('./config');

// Validate access_token
var jwtCheck = jwt({
  secret   : config.secret,
  audience : config.audience,
  issuer   : config.issuer
});

// Check for scope
requireScope = (scope) => {

  console.log(`Security Check => ${JSON.stringify(scope)}`)
  return (req, res, next) => {
    var has_scopes = req.user.scope === scope;
    if (!has_scopes) {
        res.sendStatus(401);
        return;
    }
    next();
  };
}


module.exports.jwtCheck = jwtCheck
module.exports.requireScope = requireScope

// var app = module.exports = express.Router();

// app.use('/user', jwtCheck, requireScope('full_access'));
// app.use('/account', jwtCheck, requireScope('full_access'));
// app.use('/product', jwtCheck, requireScope('full_access'));
// app.use('/transaction', jwtCheck, requireScope('full_access'));

