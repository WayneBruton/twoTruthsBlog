const express = require("express");
const router = express.Router();
const pool = require("./connection");
const readtime = require("estimated-read-time");
const jwt = require("jsonwebtoken");
var sanitizeHtml = require("sanitize-html");
const moment = require("moment")
const { visitor } = require("./visitorCheck")


let limit = 200

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


//GET FOLLOWERS
router.put("/youFollowing", checktoken, (req, res) => {
  // console.log("Body:", req.body);
  let mysql = `select member_following from follows where member = ${req.body.id}`;
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



//GET INTEREST BY TAGS
router.put("/yourInterests", checktoken, (req, res) => {
  // console.log("Body:", req.body);
  let mysql = `select tags from members where id = ${req.body.id}`;
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

//LATST ON YOUR INTERESTS
router.put("/yourLatestInterests", checktoken, (req, res) => {
  // console.log(req.body.tags);
  // router.get("/startApp", (req, res) => {
    let newlimit = (req.body.newlimit)
    console.log("NEW INTEREST LMIT", newlimit)
    let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    // console.log(now)
  let tags = req.body.tags;
  // let tags = [ 'Artificial Intelligence', 'Vue' ]
  let articles = [];
  let mysql = ``;
  tags.forEach((el) => {
    let a = `select * from articles where tags like '%${el}%' and isDraft = false and publish_date < '${now}' order by publish_date limit ${limit};`;
    mysql = mysql + a;
  });
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }

    connection.query(mysql, function (error, result) {
      if (error) throw error;
      if (result.length > 0) {
      if(result[0].constructor === Array) {
      result.forEach((el) => {
        el.forEach((el) => {
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
          articles.unshift(article);
        });
        if (newlimit < articles.length) {
          articles.length = newlimit
        }
        articles.forEach((el, index) => {
          el.word_count = readtime.text(el.text).word_count;
          el.readtime = Math.round(readtime.text(el.text).seconds / 60);
          el.text = "";
        });
      });
    } else {
      result.forEach((el) => {
        // el.forEach((el) => {
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
          articles.unshift(article);
        // });
        if (newlimit < articles.length) {
          articles.length = newlimit
        }
        articles.forEach((el, index) => {
          el.word_count = readtime.text(el.text).word_count;
          el.readtime = Math.round(readtime.text(el.text).seconds / 60);
          el.text = "";
        });
      });

    }
  }
      let uniqueArticles = Array.from(new Set(articles.map((a) => a.id))).map(
        (id) => {
          return articles.find((a) => a.id === id);
        }
      );
      uniqueArticles.sort((a, b) => (b.id > a.id) ? 1 : -1)
      if (limit < uniqueArticles.length) {
        uniqueArticles.length = limit

      }
      res.json(uniqueArticles);
    });
    connection.release();
  });
});

//GET LATEST ARTICLES
router.put("/startApp",visitor, (req, res) => {
  let newlimit = (req.body.newlimit)
  console.log("NEW LIMIT",newlimit)
  // router.get("/startApp", (req, res) => {
    let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    // console.log(now)
  let articles = [];
  let mysql = `select * from articles where isDraft = false and publish_date < '${now}'order by publish_date limit ${limit}`;
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
        articles.unshift(article);
      });
      if (newlimit < articles.length) {
        articles.length = newlimit

      }
      articles.forEach((el, index) => {
        el.word_count = readtime.text(el.text).word_count;
        el.readtime = Math.round(readtime.text(el.text).seconds / 60);
        el.text = el.text.substring(0, 250) + "...";
        if (el.text.length < 233) {
          let variable = 233 - el.text.length;
          let testArr = el.text.split();
          let spacer = " ";
          for (i = 0; i <= variable; i++) {
            testArr.push(spacer);
          }
          el.text = testArr.join();
        }
      });
      res.json(articles);
    });
    connection.release();
  });
});

//GET popular ARTICLES
router.put("/popularArticles", (req, res) => {
  let newlimit = (req.body.newlimit)
  // router.get("/startApp", (req, res) => {
    // let start = moment(new Date()).startOf('month').format('YYYY-MM-DD')
    let start = moment(new Date()).subtract(14, 'days').format('YYYY-MM-DD')
    // console.log("START", start)
    let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    // console.log(now)
  let articles = [];
  let mysql = `select * from articles where isDraft = false and createdAt > '${start}' and publish_date < '${now}' order by claps desc, createdAt limit ${limit}`;
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
        articles.unshift(article);
      });
      if (newlimit < articles.length) {
        articles.length = newlimit

      }
      articles.forEach((el, index) => {
        el.word_count = readtime.text(el.text).word_count;
        el.readtime = Math.round(readtime.text(el.text).seconds / 60);
        el.text = el.text.substring(0, 250) + "...";
        if (el.text.length < 233) {
          let variable = 233 - el.text.length;
          let testArr = el.text.split();
          let spacer = " ";
          for (i = 0; i <= variable; i++) {
            testArr.push(spacer);
          }
          el.text = testArr.join();
        }
      });
      res.json(articles);
    });
    connection.release();
  });
});


//GET LATEST ARTICLES YOU ARE FOLLOWING
router.put("/youFollowingArticles", checktoken, (req, res) => {
  let newlimit = (req.body.newlimit)
  // router.get("/startApp", (req, res) => {
    let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    // console.log(now)
    let following = req.body.following
    // console.log(following)
  let articles = [];
  let mysql = `select * from articles where member IN (?) and isDraft = false and publish_date < '${now}' order by publish_date limit ${limit}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    //I AM HERE
    connection.query(mysql,[following], function (error, result) {
      if (error) throw error;
      // console.log(result)
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
        articles.unshift(article);
      });
      if (newlimit < articles.length) {
        articles.length = newlimit

      }
      articles.forEach((el, index) => {
        el.word_count = readtime.text(el.text).word_count;
        el.readtime = Math.round(readtime.text(el.text).seconds / 60);
        el.text = el.text.substring(0, 250) + "...";
        if (el.text.length < 233) {
          let variable = 233 - el.text.length;
          let testArr = el.text.split();
          let spacer = " ";
          for (i = 0; i <= variable; i++) {
            testArr.push(spacer);
          }
          el.text = testArr.join();
        }
      });
      res.json(articles);
    });
    connection.release();
  });
});

module.exports = router;
