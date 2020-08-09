const express = require("express");
const router = express.Router();
const pool = require("./connection");
const jwt = require("jsonwebtoken");
var sanitizeHtml = require("sanitize-html");
const readtime = require("estimated-read-time");
var cloudinary = require("cloudinary").v2;
const moment = require("moment")

// CHECK TOKEN TO ENSURE LOGGED IN§
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

// CLOUDINARY CONFIG - STICK THIS IN ENV FILE
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//DELETE ARTICLE
router.put("/deleteArticle", (req, res) => {
  let imagesArray = JSON.parse(req.body.imagesArray);
  if (imagesArray.length) {
    imagesArray.forEach((el) => {
      cloudinary.uploader.destroy(`${el}`, function (result, error) {
        console.log(result), console.log("error", error);
      });
    });
  }
  let mysql1 = `delete from articles where id = ${req.body.id}`;
  let mysql2 = `delete from articleLikes where article = ${req.body.id}`;
  let mysql3 = `delete from bookmark where article = ${req.body.id}`;
  let mysql = `${mysql3};${mysql2};${mysql1}`;
  // res.json({ AWESOME: "It Kinda Works!!" });
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

//UPLOAD ARTICLE
router.post("/uploadArticle", (req, res) => {
  const searchRegExpP = /<p>/g;
  const replaceWithP = `<p style="text-align: left;">`;
  let content = req.body.content
    .replace(searchRegExpP, replaceWithP)
    .split(/\s+/)
    .join(" ");
  let sanitizedContent = sanitizeHtml(req.body.content, {
    allowedTags: [],
  }).trim();
  let word_count = readtime.text(sanitizedContent).word_count;
  let read_time = Math.round(readtime.text(sanitizedContent).seconds / 60);
  let newTags = JSON.parse(req.body.newTags);
  let tags = req.body.tags;

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    if (newTags.length) {
      for (i = 0; i < newTags.length; i++) {
        let sql1 = `insert into tags (tag) values ("${newTags[i]}")`;
        connection.query(sql1, function (error, result) {
          if (error) throw error;
        });
      }
    }
    if (!req.body.isDraft) {
      let tagsToUpdate = JSON.parse(tags);
      tagsToUpdate.forEach((el) => {
        let myTagsql = `Update tags set timesUsed = timesUsed + 1 where tag = '${el}'`;
        connection.query(myTagsql, function (error, result) {
          if (error) throw error;
        });
      });
    }
    let sql2 = `Insert into articles (member, member_name, coverImgURL, coverImgID, title, credit, content, tags, wordCount, readTime, articleImages, isDraft) values (
                  ${req.body.member}, '${req.body.member_name}', '${req.body.coverImgURL}', '${req.body.coverImgID}', '${req.body.title}', '${req.body.credit}', '${content}', '${req.body.tags}', ${word_count}, '${read_time} Min', '${req.body.articleImages}', ${req.body.isDraft}
      )`;
    connection.query(sql2, function (error, result) {
      if (error) throw error;
      res.json({ Awesome: "It Works!!!!" });
    });
    connection.release();
  });
});

//EDIT ARTICLE
router.post("/saveArticle", (req, res) => {
  const searchRegExpP = /<p>/g;
  const replaceWithP = `<p style="text-align: left;">`;
  const searchRegExpOL = /<ol>/g;
  const replaceWithOL = `<ol style="text-align: center;">`;
  const searchRegExpUL = /<ul>/g;
  const replaceWithUL = `<ul style="text-align: left;">`;
  let content = req.body.content
    .replace(searchRegExpP, replaceWithP)
    .split(/\s+/)
    .join(" ")
    .replace(searchRegExpOL, replaceWithOL)
    .split(/\s+/)
    .join(" ")
    .replace(searchRegExpUL, replaceWithUL)
    .split(/\s+/)
    .join(" ");
  let sanitizedContent = sanitizeHtml(req.body.content, {
    allowedTags: [],
  }).trim();
  let word_count = readtime.text(sanitizedContent).word_count;
  let read_time = Math.round(readtime.text(sanitizedContent).seconds / 60);
  let newTags = JSON.parse(req.body.newTags);
  let tags = req.body.tags;

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    if (newTags.length) {
      for (i = 0; i < newTags.length; i++) {
        let sql1 = `insert into tags (tag) values ("${newTags[i]}")`;
        connection.query(sql1, function (error, result) {
          if (error) throw error;
        });
      }
    }
    if (!req.body.isDraft) {
      let tagsToUpdate = JSON.parse(tags);
      tagsToUpdate.forEach((el) => {
        let myTagsql = `Update tags set timesUsed = timesUsed + 1 where tag = '${el}'`;
        connection.query(myTagsql, function (error, result) {
          if (error) throw error;
        });
      });
    }
    let sql2 = `update articles set member = ${req.body.member}, member_name = '${req.body.member_name}', coverImgURL = '${req.body.coverImgURL}', 
                  coverImgID = '${req.body.coverImgID}', title = '${req.body.title}', credit = '${req.body.credit}', content = '${content}', 
                  tags = '${req.body.tags}', wordCount = ${word_count}, readTime = '${read_time} Min', articleImages = '${req.body.articleImages}', 
                  isDraft = ${req.body.isDraft} where id = ${req.body.id}`;
    connection.query(sql2, function (error, result) {
      if (error) throw error;
      res.json({ Awesome: "It Works!!!!" });
    });
    connection.release();
  });
});

//DELETE ARTICLE
router.post("/deleteEditArticle", (req, res) => {
  // const mysql = `delete from articles where id = ${req.body.id}`;
  let mysql1 = `delete from articles where id = ${req.body.id}`;
  let mysql2 = `delete from articleLikes where article = ${req.body.id}`;
  let mysql3 = `delete from bookmark where article = ${req.body.id}`;
  let mysql = `${mysql3};${mysql2};${mysql1}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) throw error;
      res.json({ Article: "Deleted" });
    });
    connection.release();
  });
});

//GET TAGS FOR ARTICLE CREATION
router.get("/getTags", (req, res) => {
  const mysql = `select tag from tags order by tag`;
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

//GET Comments FOR ARTICLE CREATION
router.put("/getComments", (req, res) => {
  // const mysql1 = `select * from comments where articleNumber = ${req.body.id}`;
  const mysql1 = `select c.id, c.commentBy, c.articleNumber, c.comment, c.createdAt, m.avatar from comments c, members m where c.articleNumber = ${req.body.id} and c.commentBy = m.id order by c.createdAt desc`;
  // const mysql2 = `select * from replies where articleNumber = ${req.body.id}`;
  const mysql2 = `select r.id, r.commentBy, r.articleNumber, r.replyTo, r.comment, r.createdAt, m.avatar from replies r, members m where r.articleNumber = ${req.body.id} and m.id = r.commentBy`;
  let mysql = `${mysql1};${mysql2}`;
  console.log(req.body);
  // res.json({awaesome: "It Works!!"})
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) throw error;
      result[0].forEach((el) => {
        let commentID = el.id;
        // el.reply = []
        let replies = result[1].filter((reply) => {
          return reply.replyTo === commentID;
        });
        el.reply = replies;
      });

      console.log(result[0]);
      res.json(result[0]);
    });
    connection.release();
  });
});

//ADD A COMMENT
router.post("/addComment", (req, res) => {
  const searchRegExpP = /"/g;
  const replaceWithP = `'`;
  let comment = req.body.comment
    .replace(searchRegExpP, replaceWithP)
    .split(/\s+/)
    .join(" ")
    .replace(searchRegExpP, replaceWithP)
    .split(/\s+/)
    .join(" ");
    let now = new Date()
    let month;
    let day;
    if (now.getMonth() + 1 < 10) {
      month = `0${now.getMonth() + 1}`
    } else {
      month = `${now.getMonth() + 1}`
    }
    if (now.getDate() + 1 < 10) {
      day = `0${now.getDate()}`
    } else {
      day = `${now.getDate()}`
    }
    let year = now.getFullYear().toString()
    year = year.substring(year.length - 2,year.length)



    console.log(now.getFullYear(),now.getDate(), now.getMonth() + 1,now.getHours(),now.getMinutes() )
  comment = `<p style='color: grey; margin-right:7px;'><small>By: ${req.body.memberName} - ${day}/${month}/${year} ${now.getHours()}:${now.getMinutes()}  </small></p>
              <br /><p style='white-space: pre-wrap;'><small>   ${comment}</small></p>`;
  const mysql = `insert into comments (commentBy, articleNumber, comment) values (${req.body.commentBy}, ${req.body.articleNumber},"${comment}")`;
  console.log(req.body);
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
        res.json({ success: false });
      } else {
        console.log(result);
        res.json({ success: true });
      }
    });
    connection.release();
  });
});

//ADD A REPLY
router.post("/addReply", (req, res) => {
  const searchRegExpP = /"/g;
  const replaceWithP = `'`;
  let comment = req.body.comment
    .replace(searchRegExpP, replaceWithP)
    .split(/\s+/)
    .join(" ")
    .replace(searchRegExpP, replaceWithP)
    .split(/\s+/)
    .join(" ");
    let now = new Date()
    let month;
    let day;
    if (now.getMonth() + 1 < 10) {
      month = `0${now.getMonth() + 1}`
    } else {
      month = `${now.getMonth() + 1}`
    }
    if (now.getDate() + 1 < 10) {
      day = `0${now.getDate() + 1}`
    } else {
      day = `${now.getDate() + 1}`
    }
    let year = now.getFullYear().toString()
    year = year.substring(year.length - 2,year.length)
  comment = `<p style='color: grey;margin-right:7px;'><small>By: ${req.body.memberName} - ${day}/${month}/${year} ${now.getHours()}:${now.getMinutes()}  </small></p>
              <br /><p style='white-space: pre-wrap;'> <small>${comment}</small></p>`;
  // const mysql = `insert into comments (commentBy, articleNumber, comment) values (${req.body.commentBy}, ${req.body.articleNumber},"${comment}")`;
  const mysql = `insert into replies (commentBy, articleNumber, replyTo, comment) values (${req.body.commentBy}, ${req.body.articleNumber}, ${req.body.replyTo}, "${comment}")`;
  console.log(req.body);
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error);
        res.json({ success: false });
      } else {
        console.log(result);
        res.json({ success: true });
      }
    });
    connection.release();
  });
});

//DELETE COMMENT
router.put("/deleteComment", (req, res) => {
  console.log(req.body);
  // res.json({ success: true });
  let mysql1 = `delete from replies where replyTo = ${req.body.id}`
  let mysql2 = `delete from comments where id = ${req.body.id}`
  let mysql = `${mysql1};${mysql2}`
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error)
      res.json({success: false});
      } else {
      console.log(result)
      res.json({success: true});
      }
    });
    connection.release();
  });
});
//DELETE REPLY
router.put("/deleteReply", (req, res) => {
  let mysql = `delete from replies where id = ${req.body.id}`
  console.log(req.body);
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error)
      res.json({success: false});
      } else {
      console.log(result)
      res.json({success: true});
      }
    });
    connection.release();
  });
});

//Navigate to the article
router.get("/getArticle/:number", checktoken, (req, res) => {
  let mysql1 = `select a.id, a.member, a.member_name, a.coverImgURL, a.coverImgID, a.title, a.credit, a.content, a.tags, a.claps, a.wordCount, a.readTime, a.createdAt,
                  m.email, m.avatar, m.website, a.articleImages, m.showEmail
                  from articles a, members m 
                  where 
                  a.id = ${req.params.number} and a.member = m.id`;
  let mysql2 = `select distinct member from articleLikes where article = '${req.params.number}'`;
  let mysql = `${mysql1};${mysql2}`;
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
//Navigate to the Draft
router.get("/getDraft/:number", checktoken, (req, res) => {
  let mysql = `select a.id, a.member, a.member_name, a.coverImgURL, a.coverImgID, a.title, a.credit, a.content, a.tags, a.claps, a.wordCount, a.readTime, a.createdAt,
                  m.email, m.avatar, m.website, a.articleImages
                  from articles a, members m 
                  where 
                  a.id = ${req.params.number} and a.member = m.id`;
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

//Navigate to the profle
router.put("/viewProfile", checktoken, (req, res) => {
  let mysql1 = `select m.id, m.name, m.email, m.avatar, m.website , m.tags, m.aboutMember, m.showEmail from members m where m.id = ${req.body.id}`;
  let mysql2 = `select count(member_following) as followers from follows where member_following = ${req.body.id}`;
  let mysql3 = `select count(member) as following from  follows where member = ${req.body.id}`;
  let mysql = `${mysql1};${mysql2};${mysql3}`;
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

// Update Global Article likes
router.post("/updateArticleLikes", checktoken, (req, res) => {
  let mysql = `update articles set claps = (select if (sum(claps) is null, 0, sum(claps)) from articleLikes where article = ${req.body.articleID}) where id = ${req.body.articleID} `;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error)
      res.json({success: false});
      } else {
      res.json({success: true});
      }
    });
    connection.release();
  });
});

//ADD LIKES for article
router.post("/addLikes", (req, res) => {
  let mysql = `select claps from articleLikes where article = ${req.body.articleID} and member = ${req.body.userID}`;
  let mysql2 = `insert into articleLikes (member, article, claps) values (${req.body.userID}, ${req.body.articleID}, ${req.body.claps})`;
  let mysql3 = `Update articleLikes set claps = ${req.body.claps} where member = ${req.body.userID} and article = ${req.body.articleID}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) throw error;
      if (result.length) {
        connection.query(mysql3, function (error, result) {
          if (error) throw error;
          res.json(result);
        });
      } else {
        connection.query(mysql2, function (error, result) {
          if (error) throw error;
          res.json(result);
        });
      }
    });
    connection.release();
  });
});

// Get Likes Hisory
router.put("/getHistoryLikes", checktoken, (req, res) => {
  let mysql = `select l.id, l.member, l.article, l.claps, l.createdAt, a.member from articleLikes l, articles a, members m where l.article = a.id 
                and a.member = m.id
                and m.id = ${req.body.id} `;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        console.log(error)
      res.json({success: false});
      } else {
        let currentMonth = moment(new Date()).format("MMM-YYYY")
        result.forEach((el) => {
          el.month = moment(el.createdAt).format("MMM-YYYY")
          el.currentMonth = currentMonth
        })
        // console.log(result)
        let currentMonthLikes = result.reduce((prev, el) => {
          if (el.month == el.currentMonth) {
            return prev = el.claps + prev
          } else {
            return prev = prev
          }
      }, 0)
        let totalLikes = result.reduce((prev, el ) => {
          return prev = el.claps + prev
        },0)
        
        
        let allLikes = {
          total: totalLikes,
          currentMonth: currentMonthLikes
        }
        // console.log(allLikes)
      res.json(allLikes);
      }
    });
    connection.release();
  });
});



module.exports = router;
