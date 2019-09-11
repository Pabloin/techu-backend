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
    res.status(result.status).send(result);
  } catch (err) {
    return res.status(Code.HTTP_500_SERVER_ERROR).send({
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
    if (mockBCRA == 'true') {
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
        response.status(Code.HTTP_500_SERVER_ERROR).send({
          status: Code.HTTP_500_SERVER_ERROR,
          error: err
        });
       }

       if (response.statusCode === 403) {
         res.status(response.statusCode).send(`Code 403: Error Límite de 100 invocaciones x día del BCRA`);
         return;
       }

       let arrRta = JSON.parse(response.body);
     
       let rta = getRtaBCRA(options, arrRta);

       res.status(Code.HTTP_200_OK).send(rta);
     
       console.log(`/api-bcra/usd_uf (${JSON.stringify(options)})`)

    });

  } catch (e) {
    console.log(`API BCRA ERROR: Uso Mock ${arrRta.length} -> error: ${e}`)

    let rta = getRtaBCRA_Mock(options);
  
    res.status(Code.HTTP_200_OK).send(rta);
  
    console.log(`/api-bcra/usd_uf (${JSON.stringify(options)})`)
  }

});

getRtaBCRA_Mock = (options) => {
  console.log(`getRtaBCRA_Mock(${JSON.stringify(options)})`)
  // Por el caso el limite de consumo de 100 request x dia por Tocken
  let arrRta_Mock = [

    { "d": "2017-02-02", "v": 57.09 },
    { "d": "2017-02-30", "v": 59.08 },
    { "d": "2017-04-29", "v": 58.2 },
    { "d": "2017-04-28", "v": 58.08 },
    { "d": "2017-04-27", "v": 55.71 },
    
    { "d": "2018-05-02", "v": 57.09 },
    { "d": "2018-06-30", "v": 59.08 },
    { "d": "2018-06-29", "v": 58.2 },
    { "d": "2018-08-28", "v": 58.08 },
    { "d": "2018-08-27", "v": 55.71 },

    { "d": "2019-07-29", "v": 58.2 },
    { "d": "2019-07-30", "v": 59.08 },
    { "d": "2019-07-28", "v": 58.08 },
    { "d": "2019-08-26", "v": 55.34 },
    { "d": "2019-08-27", "v": 55.71 },
    { "d": "2019-09-02", "v": 57.09 },
    { "d": "2019-09-03", "v": 55.78 },

  ];

  return getRtaBCRA(options, arrRta_Mock)
}

getRtaBCRA = (options, arrRta) => {
  console.log(`getRtaBCRA(${JSON.stringify(options)}, ${arrRta.length})`)
  
  let sonYears = (e) => Number.parseInt(e) > 2000 && Number.parseInt(e) < 2020
  
  arrRta = arrRta.reverse()

  let dolarData = (options.select === 'last') ? arrRta[0]
                : (options.select === 'all') ? arrRta
                : (sonYears(options.select)) ? arrRta.filter(e => e.d.includes(options.select) )
                : ((options.select + ' ').length >= 4) ? arrRta.filter(e => e.d.includes(options.select) )
                : arrRta

  console.log(`/api-bcra/usd_uf (${JSON.stringify(options)}) dolarData=${dolarData}`)

  let rta =  {
    status: Code.HTTP_200_OK,
    data: dolarData
  };

  return rta

}

module.exports = router;
