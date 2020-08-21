const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: 465, //587
    secure: true,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailError;

  async function sendMail(subject, recipient, output) {
    let mailOptions = {
      // from: "Perfect Staff Contact Form <wayne@eccentrictoad.com>",
      from: "Vellum Contact Form <support@perfect-staff.com>",
      to: `${recipient}`,
      subject: `${subject}`,
      text: "Hello world?",
      html: output,
    };
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error with connection");
        mailError = true;
      } else {
        mailError = false;
        res.json({ error: false });
      }
    });
  }

  module.exports =  sendMail;
