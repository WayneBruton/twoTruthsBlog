const express = require("express");
const router = express.Router();
const pool = require("./connection");
const nodemailer = require("nodemailer");
const sendMail = require("./contactFiles");

router.put("/contactForm", function (req, res) {
  let firstName = req.body.firstName;
  let email = req.body.email;
  let message = req.body.message;
  let subject = req.body.subject;
  let recipient = "waynebruton@icloud.com";
  let mailError;

  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>First Name: ${firstName}</li><br>

      <li>Email: ${email}</li><br>
    </ul><br>
    <h3>Message</h3><br>
    <p style="background-color: grey; padding: 5px 5px; color: white;">${message}</p>
      `;
  sendMail(subject, recipient, output)
    .then(async function () {
      if (mailError) {
        res.json({ error: true });
      } else {
        res.json({ error: false });
      }
    })
    .catch(async function (error) {
      console.log(error);
      res.json({ error: true });
    });
});

module.exports = router;
