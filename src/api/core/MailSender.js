const nodemailer = require('nodemailer');
const Common = require('../core/Common');

class MailSender {

  constructor() {

    this.transporter = nodemailer.createTransport(Common.getMailConfig());

  }

  sendMail(options) {

    this.transporter.sendMail(options, (error, info) => {
      if (error) {
        console.log('Error al enviar el mail: ', error );
        return;
      }
      console.log('Mail enviado: ', info.messageId );
      return true;
    });
  }
}

module.exports = new MailSender();
