const express = require("express");
const router = express.Router();
const pool = require("./connection");
const sendMail = require("./contactFiles");
var md5 = require("blueimp-md5");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const moment = require("moment")

// const encryptedString = cryptr.encrypt('bacon');
// const decryptedString = cryptr.decrypt(encryptedString);
 
// console.log(encryptedString); // e7b75a472b65bc4a42e7b3f78833a4d00040beba796062bf7c13d9533b149e5ec3784813dc20348fdf248d28a2982df85b83d1109623bce45f08238f6ea9bd9bb5f406427b2a40f969802635b8907a0a57944f2c12f334bd081d5143a357c173a611e1b64a
// console.log(decryptedString);



router.put("/memberDetails", (req, res) => {
  let mysql = `select paidMember, expires from members where id = ${req.body.id}`;
  console.log(req.body);
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) throw error;
      res.json(result);
    });
    connection.release();
  });
});

router.put("/getPaidURL", (req, res) => {
  let url = req.body
  console.log(url)
  const encryptedString = cryptr.encrypt(JSON.stringify(url));
  res.json({url: encryptedString})
});

router.put("/checkPaidURL", (req, res) => {

  let str = req.body.str
  console.log(str)
const decryptedString = JSON.parse(cryptr.decrypt(str));
  console.log(decryptedString);
  // const encryptedString = cryptr.encrypt(JSON.stringify(url));

  res.json({decrypt: decryptedString})
});





router.put("/processPayment", (req, res) => {
  let mysql = `update members set paidMember = true, expires = '${req.body.newExpiry}' where id = ${req.body.id}`;
console.log(mysql)
  console.log("THE BODY",req.body);
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) throw error;
      res.json(result);
    });
    connection.release();
  });
});



router.get("/getallowedViewsNonSubscriber", (req, res) => {
  let mysql = `select * from allowedViewsNonSubscriber`;
console.log(mysql)
  console.log("THE BODY",req.body);
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) throw error;
      res.json(result);
    });
    connection.release();
  });
});

router.put("/allowedViewsNonSubscriber", (req, res) => {
  let mysql = `update allowedViewsNonSubscriber set allowedViews = ${req.body.allowedViews}`;
console.log(mysql)
  console.log("THE BODY",req.body);
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) throw error;
      res.json(result);
    });
    connection.release();
  });
});


module.exports = router;
