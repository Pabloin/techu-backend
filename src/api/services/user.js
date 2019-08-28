const ServerError = require('../../lib/error');

var UserModel = require('../core/db.models').UserModel
var AccountService = require('../services/account')

var secureUserToken = require('../security/validate-user-token')

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createUser = async (options) => {

  var username = options.body.username
  var password = options.body.password

  // Paso 1: Usuario y password es obligatorio
  if (!username || !password) {
      return {
        status: 400,
        data: `User credentials "username, password" no pueden ser nulas.`
      };
  }


  // Paso 2: Chequea si el usuario ya existe
  var userList = await UserModel
                        .find({ 'username' : username }, 'userId username isLogged')
                        .exec();

  console.log(`createUser(${username}) rta = ${JSON.stringify(userList)}`);

  if (userList.length > 0) {
      return {
        status: 400,
        data: `User "${username}" already exist.`
      };
  }

  // Paso 3: Se crea un nuevo usuario (Y se lo logonea) -> Id de 4 digitos

  numeroAleatorio = (min, max) => Math.round(Math.random() * (max - min) + min);

  var userId   = numeroAleatorio(1000, 9999)

  var isLogged = true;

  var user = new UserModel({
      userId    : userId,
      username  : username,
      password  : password,
      firstName : options.body.firstName,
      lastName  : options.body.lastName,
      email     : options.body.email,
      isLogged  : isLogged,
  });

  console.log(`To Save ${JSON.stringify(user)}`)


  var id_token = secureUserToken.createIdToken(user)
  var access_token = secureUserToken.createAccessToken()

  console.log(`TOKENS: id_token     ${id_token}`)
  console.log(`TOKENS: access_token ${access_token}`)

  console.log(`STEP 1: Create users ${JSON.stringify(user)} `)

  user.save((err) => {
    if (err) return handleError(err);
  })

  // Crea los productos para el Usuario:
  AccountService.createProductsForUser(user, (err) => {
    if (err) return handleError(err);
  })

  console.log(`STEP 2: Create Accounts ${JSON.stringify(user)} `)

  return {
    status: 201,
    data: {
          id_token : id_token,
      access_token : access_token
    }
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

  var username = options.username;
  var password = options.password;

  // Paso 1: Usuario y password es obligatorio
  if (!username || !password) {
    return {
      status: 400,
      data: `User credentials "username, password" no pueden ser nulas.`
    };
  }


  // Paso 2: Chequea que el usuario exista
  var userList = await UserModel
                    .find({ 'username' : username }, 'userId username password isLogged')
                    .exec();

  console.log(`loginUser(${username}) rta = ${JSON.stringify(userList)}`);

  if (userList.length === 0) {
    return {
      status: 404,
      data: `User "${username}" not found.`
    };
  }

  // Paso 3: Realiza el login del usuario si la passwor esta ok
  var user = userList[0]

  if (user.password === password) {

    // Login True
    user.isLogged = true
    var result = await user.save();

    var id_token     = secureUserToken.createIdToken(user)
    var access_token = secureUserToken.createAccessToken()

    console.log(`TOKENS: id_token     ${id_token}`)
    console.log(`TOKENS: access_token ${access_token}`)

    console.log(`OK loginUser(${username}) OK rta = ${JSON.stringify(result)}`);

    return {
      status: 201,
      data: {
            id_token : id_token,
        access_token : access_token
      }
    };

    // return {
    //   status: 200,
    //   data: `User "${username}" Authorzed. Login OK.`
    // };
  }

  return {
    status: 400,
    data: `User "${username}" not Authorzed. Login Incorrect.`
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.logoutUser = async (options) => {

  var username = options.username;

  var userList = await UserModel
                    .find({ 'username' : username }, 'userId username isLogged')
                    .exec();

  console.log(`logoutUser(${username}) rta = ${JSON.stringify(user)}`);

  if (userList.length === 0) {
    return {
      status: 404,
      data: `User "${username}" not found.`
    };
  }

  var user = userList[0]

  // Login True
  user.isLogged = false
  var result = await user.save();

  console.log(`OK loginUser(${username}) OK rta = ${JSON.stringify(result)}`);

  return {
    status: 200,
    data: 'logoutUser ok!'
  };
};






/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.recoverPassword = async (options) => {

  var username = options.username;
  var email = options.email;

  var userList = await UserModel
                    .find({ 'username' : username }, 'userId username email password')
                    .exec();

  console.log(`recoverPassword(${username}) rta = ${JSON.stringify(user)}`);

  if (userList.length === 0) {
    return {
      status: 404,
      data: `User "${username}" not found.`
    };
  }

  var user = userList[0]

  var result = {
    username : username,
    password : user.password,
    emailRecived : email,
    emailRegister : user.email
  }

  // TODO Sent Mail Engine

  console.log(`OK recoverPassword(${username}) OK rta = ${JSON.stringify(result)}`);

  return {
    status: 200,
    data: result
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



  // Following
  // https://www.thepolyglotdeveloper.com/2019/02/building-rest-api-mongodb-mongoose-nodejs/
