


module.exports.testDatabaseModel = () => {

  console.log('testDatabaseModel()');

  var UserModel         = require('./db.models').UserModel
  var TransactiontModel = require('./db.models').TransactiontModel
  var ProductModel      = require('./db.models').ProductModel
  var AccountModel      = require('./db.models').AccountModel

  UserModel.find({ 'userId' : 1 }, 'userId username password', (err, user) => {

    console.log(`testDatabaseModel() rta = ${JSON.stringify(user)}`);

  })


  console.log(`testDatabaseModel() rta = `);
}


module.exports.testMailSender = () => {

  console.log('testMailSender()');

  var options = {
    from: process.env.Techu_MAIL_SENDER_USER,
      to: process.env.Techu_MAIL_SENDER_USER,
    subject: 'Hola Pablo v2',
    text: 'Contenido del email v2'
  };

  var MailSender = require('./MailSender').sendMail(options)

  console.log(`testDatabaseModel() rta = `);
}
