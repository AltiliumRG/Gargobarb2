const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send a simple email using Gmail SMTP
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email body
 * @param {string} html - HTML email body
 */
const sendMail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"GargoBarb" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };
    
    // In background, log success without blocking request
    const info = await transporter.sendMail(mailOptions);
    console.log(`📩 Correo enviado a ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Error enviando correo a ${to}:`, error.message);
    throw error;
  }
};

module.exports = {
  sendMail,
};
