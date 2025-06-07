// mailer.js
const nodemailer = require('nodemailer');

async function enviarAlerta(titulo, mensaje) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fabrilduran@gmail.com', // TU CORREO
      pass: 'eogo pmyd nsfe ikuh' // Contraseña de App (no tu contraseña normal)
    }
  });

  let info = await transporter.sendMail({
    from: '"Hydra Alertas 📈" <fabrilduran@gmail.com>',
    to: 'fabrilduran@gmail.com',
    subject: titulo,
    text: mensaje
  });

  console.log('📬 Alerta enviada: %s', info.messageId);
}

module.exports = enviarAlerta;
