const express = require("express");
const router = express.Router();
const pool = require("./connection");
const readtime = require("estimated-read-time");
const jwt = require("jsonwebtoken");
var sanitizeHtml = require("sanitize-html");

let checktoken = (req, res, next) => {
  let header = req.header("Authorization");
  let token = header.split(":")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: "Token is not valid",
        });
      } else {
        next();
      }
    });
  } else {
    res.json({
      success: false,
      message: "There is no Token",
    });
  }
};

let articles = [];

router.get("/startApp", checktoken, (req, res) => {

  articles = [];
  let mysql = `select * from articles where isDraft = false order by createdAt`
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    //I AM HERE
    connection.query(mysql, function (error, result) {
      if (error) throw error;
      result.forEach((el) => {
        let article = {
          title: el.title,
          credit: el.credit,
          author: el.member_name,
          src: el.coverImgURL, 
          publicId: el.coverImgID,   
          text: sanitizeHtml(el.content, {
            allowedTags: [],
          }),
          flex: 6,
          id: el.id,
        };
        articles.unshift(article)
      })
      articles.forEach((el, index) => {
        el.word_count = readtime.text(el.text).word_count;
        el.readtime = Math.round(readtime.text(el.text).seconds / 60);
        el.text = el.text.substring(0, 250) + "...";
        if (el.text.length < 233) {
          let variable = 233 - el.text.length;
          let testArr = el.text.split()
          let spacer = " "
          for (i = 0; i <= variable; i++) {
            testArr.push(spacer)
          }
          el.text = testArr.join()

        }
      });
      res.json(articles);
    });
    connection.release();
  });
});



module.exports = router;
