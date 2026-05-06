const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Cấu hình transporter (dùng Gmail SMTP)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Nội dung email
  const message = {
    from: `"Kinetic Sports" <${process.env.EMAIL_USER}>`,
    to: options.to || options.email,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // 3. Gửi email
  await transporter.sendMail(message);
};

module.exports = sendEmail;
