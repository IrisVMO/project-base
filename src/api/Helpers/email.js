const nodemailer = require('nodemailer');
const { emailHelper, password } = require('../../configs/config')

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: emailHelper,
    pass: password
  },
});

module.exports = transporter;
