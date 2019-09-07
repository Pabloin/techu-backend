
'use strict'

let Const = {

  CUENTA_TYPE_CA: 'CA',
  CUENTA_TYPE_CA_desc: 'Caja de Ahorro',

  CUENTA_TYPE_CC: 'CC',
  CUENTA_TYPE_CC_desc: 'Cuenta Corriente',

  CUENTA_TYPE_CA_USD: 'CA USD',
  CUENTA_TYPE_CA_USD_desc: 'Caja de Ahorro en Dólares',

  CUENTA_TYPE_TJ_VISA: 'TJ VISA',
  CUENTA_TYPE_TJ_VISA_desc: 'Tarjeta VISA Gold',

  CUENTA_TYPE_TJ_MASTER: 'TJ MASTER',
  CUENTA_TYPE_TJ_MASTER_desc: 'Tarjeta MASTER Gold',

  CUENTA_CURRENCY_ARS: 'ARS',
  CUENTA_CURRENCY_USD: 'USD',

  MOV_TIPO_HABERES: 'Acreditacion de Haberes',

  OP_TRANSFERENCIA: 'TRANSFERENCIA',
  OP_EXCHANGE:      'EXCHANGE',

}


let Code = {
  HTTP_200_OK:               200,
  HTTP_201_CREATED_OK:       201,
  HTTP_400_BAD_REQUEST:      400,
  HTTP_404_NOT_FOUND:        404,
  HTTP_500_SERVER_ERROR:     500,
}

module.exports.Const = Object.freeze(Const);
module.exports.Code  = Object.freeze(Code);

