const ServerError = require('../../lib/error');

const CORE_DB = require('../core/db.test');

/**
 * @param {Object} options
 * @param {Integer} options.accountId Id de la cuenta
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getAccount = async (options) => {
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


  CORE_DB.testDatabaseModel()

  return {
    status: 200,
    data: 'getAccount ok!'
  };
};

