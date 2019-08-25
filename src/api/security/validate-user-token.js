var express = require('express');
var _       = require('lodash');
var config  = require('./config');
var jwt     = require('jsonwebtoken');

function createIdToken(user) {

  console.log(`createIdToken z${JSON.stringify(user)}`)

  var userFlat = {}
  userFlat.userId    = user.userId;
  userFlat.username  = user.username;
  userFlat.firstName = user.firstName;
  userFlat.lastName  = user.lastName;
  userFlat.email     = user.email;

  console.log(`createIdToken userFlat ${JSON.stringify(userFlat)}`)

  var id_token = jwt.sign(userFlat, config.secret, { expiresIn: 60*60*5 });

  console.log(`createIdToken id_token ${JSON.stringify(id_token)}`)

  return id_token;
}

function createAccessToken() {

  console.log(`createAccessToken `)

  return jwt.sign({
    iss: config.issuer,
    aud: config.audience,
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    scope: 'full_access',
    sub: "lalaland|gonto",
    jti: genJti(), // unique identifier for the token
    alg: 'HS256'
  }, config.secret);
}

// Generate Unique Identifier for the access token
function genJti() {

  console.log(`genJti `)

  let jti = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
      jti += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return jti;
}




module.exports.createIdToken = createIdToken
module.exports.createAccessToken = createAccessToken

