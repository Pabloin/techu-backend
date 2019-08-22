const ServerError = require('../../lib/error');

var UserModel = require('../core/db.models').UserModel


/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
// module.exports.createUser = async (options) => {
module.exports.createUser = async (options) => {

  var userId   = Math.floor(Math.random() * 1000);
  var isLogged = false;

  var user = new UserModel({
      userId    : userId,
      username  : options.body.username,
      password  : options.body.password,
      firstName : options.body.firstName,
      lastName  : options.body.lastName,
      isLogged  : isLogged,
  });

  console.log(`To Save ${JSON.stringify(user)} `)

  user.save((err) => {
    if (err) return handleError(err);


  })

  return {
    status: 200,
    data: `createUser with id ${userId} ok! => ${JSON.stringify(user)}`
  };
};

/**
 * @param {Object} options
 * @param {String} options.username Nombre del usuario para el login
 * @param {String} options.password Password del usuario sin encriptar
 * @throws {Error}
 * @return {Promise}
 */
module.exports.loginUser = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: 'loginUser ok!'
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.logoutUser = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: 'logoutUser ok!'
  };
};














  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

