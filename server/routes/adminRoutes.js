const express = require("express");
const router = express.Router();
const pool = require("./connection");
// const jwt = require("jsonwebtoken");
// var sanitizeHtml = require("sanitize-html");
// const readtime = require("estimated-read-time");
// var cloudinary = require("cloudinary").v2;
// const moment = require("moment");
const { sendErrorReport, mailErrorResult } = require("./contactFiles");

router.get("/getFAQ", (req, res) => {
  let mysql = `select *  from faq order by question, createdAt`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        sendErrorReport(mysql, req.path, error);
        res.json({ error: true });
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/addFAQ", (req, res) => {
  console.log(req.body);
  const searchRegExpP = /"/g;
  const replaceWithP = `'`;
  let answer = req.body.answer
    .replace(searchRegExpP, replaceWithP)
    .split(/\s+/)
    .join(" ");
  let question = req.body.question
    .replace(searchRegExpP, replaceWithP)
    .split(/\s+/)
    .join(" ");
  let mysql = `insert into faq (question, answer) values ("${question}","${answer}")`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        sendErrorReport(mysql, req.path, error);
        res.json({ error: true });
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.post("/deleteFAQ", (req, res) => {
  console.log(req.body);
  let mysql = `delete from faq where id = ${req.body.id}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        sendErrorReport(mysql, req.path, error);
        res.json({ error: true });
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.put("/editFAQ", (req, res) => {
  const searchRegExpP = /"/g;
  const replaceWithP = `'`;
  let answer = req.body.answer
    .replace(searchRegExpP, replaceWithP)
    .split(/\s+/)
    .join(" ");
  let question = req.body.question
    .replace(searchRegExpP, replaceWithP)
    .split(/\s+/)
    .join(" ");

  // console.log(req.body);

  let mysql = `update faq set question = "${question}", answer = "${answer}" where id = ${req.body.id}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        sendErrorReport(mysql, req.path, error);
        res.json({ error: true });
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

module.exports = router;
