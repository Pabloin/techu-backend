const ServerError = require('../../lib/error');
const Quotes = require('../core/Quotes.json');

/**
 * @param {Object} options
 * @param {Integer} options.quoteId QuoteId
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getQuote = async (options) => {

  console.log(`getQuote(${options})`)

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

  var rand = Math.floor(Math.random() * Quotes.length);

  return {
    status: 200,
    data: Quotes[rand]
  };
};

/**
 * @param {Object} options
 * @param {Integer} options.quoteId QuoteId
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getProtectedQuote = async (options) => {

  console.log(`getProtectedQuote(${options})`)

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

  var rand = Math.floor(Math.random() * Quotes.length);

  return {
    status: 200,
    data: Quotes[rand]
  };
};

