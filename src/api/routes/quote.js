const express = require('express');
const quote = require('../services/quote');
const Common = require('../core/Common');
const request = require('request');
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
      status: 500,
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
          status: 500,
          error: erro
        });
       }

       if (response.statusCode === 403) {
         res.status(response.statusCode).send(`Code 403: Error Límite de 100 invocaciones x día del BCRA`);
         return;
       }

       arrRta = JSON.parse(body)

       console.log(`API BCRA OK ${arrRta.length}`)

       let dolarData = (options.select === 'last') ? arrRta[arrRta.length - 1] : arrRta

       console.log(`/api-bcra/usd_uf (${JSON.stringify(options)}) dolarData=${arrRta[arrRta.length - 1]}`)
     
       let rta =  {
         status: response.statusCode,
         data: dolarData
       };
     
       res.status(response.statusCode).send(dolarData);
     
       console.log(`/api-bcra/usd_uf (${JSON.stringify(options)})`)

    });

  } catch (e) {

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

    arrRta = arrRta_Mock;

    console.log(`API BCRA ERROR: Uso Mock ${arrRta.length} -> error: ${e}`)

    let dolarData = (options.select === 'last') ? arrRta[arrRta.length - 1] : arrRta

    console.log(`/api-bcra/usd_uf (${JSON.stringify(options)}) dolarData=${dolarData}`)
  
    let rta =  {
      status: response.statusCode,
      data: dolarData
    };
  
    res.status(response.statusCode).send(dolarData);
  
    console.log(`/api-bcra/usd_uf (${JSON.stringify(options)})`)

  }

});


module.exports = router;
