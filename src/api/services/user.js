const ServerError = require('../../lib/error');
const Common = require('../core/Common')
const AccountService = require('../services/account')
const secureUserToken = require('../security/validate-user-token')
const UserModel = require('../core/db.models').UserModel


/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getUsersList = async (options) => {

  var userList = await UserModel
    .find({ }, 'userId username firstName lastName email')
    .exec();

  if (userList.length == 0) {
    console.log('No hay usuarios en el sistema.')
  }

  return {
    status: 200,
    data: userList
  };
};


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
        error: `User credentials "username, password" no pueden ser nulas.`
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
        error: `User "${username}" already exist.`
      };
  }

  // Paso 3: Se crea un nuevo usuario (Y se lo logonea) -> Id de 4 digitos

  

  var userId   = Common.numeroAleatorio(1000, 9999)

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


  console.log(`STEP 2: Create Accounts for ${JSON.stringify(user)} `)

  AccountService.createProductsForUser(user, (err) => {
    if (err) return handleError(err);
  })

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
      error: `User credentials "username, password" no pueden ser nulas.`
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
      error: `User "${username}" not found.`
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
    error: `User "${username}" not Authorzed. Login Incorrect.`
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
      error: `User "${username}" not found.`
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
      error: `User "${username}" not found.`
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
  //      ... funciona, pero lo anulo para que no moleste con mails, y temas de seguridad ..

  // enviarMailRecuperoContraseña(result);
 

  console.log(`OK recoverPassword(${username}) OK rta = ${JSON.stringify(result)}`);

  return {
    status: 200,
    data: result
  };
};



enviarMailRecuperoContraseña = (result) => {

  var emailMessage = `
    - to: ${result.emailRecived} (ingresado)
    - cc: ${result.emailRegister} (registrado en la BD)
    
    Estimado Sr/a ${result.username}:
    <br>
    Hemos recibido en nuestro sitio Tu! Open Bank una solicitud de
    recuperación de constraseña para su usuario.
    
    Su clave de acceso es ${result.password}
    
    Por favor, no descuide sus constraseñas, la seguridad la construimos entre todos.
    
    Atentamente<br>
    Tu! Open Bank.
  `;

  var options = {
    service: 'gmail',
    from: process.env.Techu_MAIL_SENDER_USER,
      to: process.env.Techu_MAIL_SENDER_USER,
    subject: 'Tu! Open Bank - Recupero de conrtaseña',
    text: emailMessage
  };

  var MailSender = require('../core/MailSender').sendMail(options)
}

