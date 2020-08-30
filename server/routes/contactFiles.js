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

  // const resutting =  

  function mailErrorResult() {
    return mailError
  }


  async function sendMail(subject, recipient, output) {
    // let mailError;
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
        mailError = true;
        console.log("Error with connection", mailError);
      } else {
        mailError = false;
        console.log("ZERO Error with connection", mailError);

      }
    });
  } 

  async function sendErrorReport(mysql, path,  error) {
    // let mailError;
    let recipient = "waynebruton@icloud.com"; //NEEDED
    let subject = `SQL ERR`; 
    const output = `
                          <h3>SQL Error</h3>
                          <h3>Message</h3><br>
                          <p style="background-color: grey; padding: 5px 5px; color: white;">${path}</p>
                          <p style="background-color: grey; padding: 5px 5px; color: white;">${mysql}</p>
                          <p style="background-color: grey; padding: 5px 5px; color: white;">${error}</p>
        `; //NEEDED

    let mailOptions = {

      // from: "Perfect Staff Contact Form <wayne@eccentrictoad.com>",
      from: "Vellum Back End <support@perfect-staff.com>",
      to: `${recipient}`,
      subject: `${subject}`,
      text: "Hello world?",
      html: output,
    };
    await transporter.sendMail(mailOptions, (error, info) => {

      if (error) {
        mailError = true;
        console.log("Error with connection", mailError);
      } else {
        mailError = false;
        console.log("ZERO Error with connection", mailError);

      }
    });
  } 

  module.exports =  { sendMail,sendErrorReport, mailErrorResult, mailError };
