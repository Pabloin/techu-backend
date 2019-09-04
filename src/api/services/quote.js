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

  var rand = Math.floor(Math.random() * Quotes.length);

  return {
    status: 200,
    data: Quotes[rand]
  };
};


