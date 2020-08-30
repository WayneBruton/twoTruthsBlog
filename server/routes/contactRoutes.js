const express = require("express");
const router = express.Router();
// const pool = require("./connection");
// const nodemailer = require("nodemailer");
const { sendMail, mailErrorResult } = require("./contactFiles");

router.put("/contactForm", function (req, res) {
  let firstName = req.body.firstName;
  let email = req.body.email;
  let message = req.body.message;
  // let mailError;
  let subject = req.body.subject; //NEEDED
  let recipient = "waynebruton@icloud.com"; //NEEDED
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>First Name: ${firstName}</li><br>

      <li>Email: ${email}</li><br>
    </ul><br>
    <h3>Message</h3><br>
    <p style="background-color: grey; padding: 5px 5px; color: white;">${message}</p>
      `; //NEEDED
  // async function sendThis() {
  sendMail(subject, recipient, output)
    .then(async function () {
      setTimeout(() => {
        const hello = mailErrorResult();
        console.log("Error: ", hello);
        res.json({ error: hello });
      }, 2500);
    })
    // }
    // sendThis();
    // .then(async function () {

    // const hello = await mailErrorResult()
    // await console.log("Error: ", hello)
    // await res.json({ error: hello })
    // })
    .catch(async function (error) {
      console.log(error);
      res.json({ error: true });
    });
});

module.exports = router;
