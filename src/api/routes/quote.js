const express = require('express');
const quote = require('../services/quote');
const Common = require('../core/Common');
const request = require('request');
const Code = require('../core/Const').Code
const router = new express.Router();

/**
 * Retorna un mensaje random para el usuario
 */
router.get('/:quoteId', async (req, res, next) => {
  const options = {
    quoteId: req.params['quoteId']
  };

  try {
    const result = await quote.getQuote(options);
    res.status(result.status).send(Common.getJsonResponse(result));
  } catch (err) {
    return res.status(500).send({
      status: Code.HTTP_500_SERVER_ERROR,
      error: 'Server Error'
    });
  }
});

/**
 * Cotizacion del dolar BCRA
 * @param {Object} options    last // all
 */
router.get('/api-bcra/usd_uf/:select?', async (req, res, next) => {

  const options = {
    select: req.params['select']
  };

  let arrRta = [];

  try {

    var tokenBCRA = Common.getTokenApiBCRA_Config();
    var mockBCRA = process.env.Techu_TOKEN_BCRA_API_MOCK
    if (mockBCRA) {
      throw Error('Mock BCRA Enabled')
    }

    var reqOptions = {
      url: 'https://api.estadisticasbcra.com/usd_of',
      method: 'GET',
      headers:{
        "Authorization": `Bearer ${tokenBCRA}`
      }
    };
  
    request(reqOptions, (err, response, body) => {
      if (err) {
        response.status(500).send({
          status: Code.HTTP_500_SERVER_ERROR,
          error: erro
        });
       }

       if (response.statusCode === 403) {
         res.status(response.statusCode).send(`Code 403: Error Límite de 100 invocaciones x día del BCRA`);
         return;
       }
     
       let rta = getRtaBCRA(options, arrRta);

       res.status(response.statusCode).send(dolarData);
     
       console.log(`/api-bcra/usd_uf (${JSON.stringify(options)})`)

    });

  } catch (e) {
    console.log(`API BCRA ERROR: Uso Mock ${arrRta.length} -> error: ${e}`)

    let rta = getRtaBCRA_Mock(options);
  
    res.status(response.statusCode).send(dolarData);
  
    console.log(`/api-bcra/usd_uf (${JSON.stringify(options)})`)
  }

});

getRtaBCRA_Mock = (options) => {
  console.log(`getRtaBCRA_Mock(${JSON.stringify(options)})`)
  // Por el caso el limite de consumo de 100 request x dia por Tocken
  let arrRta_Mock = [
    { "d": "2019-08-26", "v": 55.34 },
    { "d": "2019-08-27", "v": 55.71 },
    { "d": "2019-08-28", "v": 58.08 },
    { "d": "2019-08-29", "v": 58.2 },
    { "d": "2019-08-30", "v": 59.08 },
    { "d": "2019-09-02", "v": 57.09 },
    { "d": "2019-09-03", "v": 55.78 }
  ];

  return getRtaBCRA(options, arrRta_Mock)
}

getRtaBCRA = (options, arrRta) => {
  console.log(`getRtaBCRA(${JSON.stringify(options)}, ${arrRta.length})`)
  
  let dolarData = (options.select === 'last') ? arrRta[arrRta.length - 1] : arrRta

  console.log(`/api-bcra/usd_uf (${JSON.stringify(options)}) dolarData=${dolarData}`)

  let rta =  {
    status: 200,
    data: dolarData
  };

  return rta

}

module.exports = router;
