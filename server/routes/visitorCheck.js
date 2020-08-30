const express = require("express");
const router = express.Router();
const pool = require("./connection");

let visitor = (req, res, next) => {
  console.log(req.path);
  var ip =
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  console.log(ip);
  next()
};

// router.post("/deleteFAQ", (req, res) => {
//   console.log(req.body);
//   let mysql = `delete from faq where id = ${req.body.id}`;
//   pool.getConnection(function (err, connection) {
//     if (err) {
//       connection.release();
//       resizeBy.send("Error with connection");
//     }
//     connection.query(mysql, function (error, result) {
//       if (error) {
//         sendErrorReport(mysql, req.path, error);
//         res.json({ error: true });
//       } else {
//         res.json(result);
//       }
//     });
//     connection.release();
//   });
// });

module.exports = { visitor };
