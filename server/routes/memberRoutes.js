const express = require("express");
const router = express.Router();
const pool = require("./connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const totp = require("otplib").totp;
const otp_secret = process.env.OTP_SECRET;
const axios = require("axios");
const moment = require("moment");
const sendMail = require("./contactFiles");

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

const saltRounds = parseInt(process.env.SALT_ROUNDS);

function jwtSignUser(user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: ONE_WEEK,
  });
}
//GET ADMINSTATUS USERS
router.get("/getAdmin", (req, res) => {
  let mysql = `select id, name, isAdmin from members order by isAdmin desc, name`;
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

//GET ADMINSTATUS USERS
router.put("/updateAdmin", (req, res) => {
  let mysql = `update members set isAdmin = ${req.body.isAdmin} where id = ${req.body.id}`;
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





//CHECK EMAIL WHEN REGISTERING
router.put("/checkEmail", (req, res) => {
  let mysql = `select * from members where email = '${req.body.email}'`;
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

router.put("/checkName", (req, res) => {
  let mysql = `select * from members where name = '${req.body.name}'`;
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

//ARE FOLLOWING AND BOOKMARKED??
router.put("/followingandbookmarked", (req, res) => {
  const mysql1 = `select * from bookmark where member = ${req.body.member} and article = ${req.body.article}`;
  const mysql2 = `select * from follows where member = ${req.body.member} and member_following = ${req.body.member_following}`;
  const mysql = `${mysql1};${mysql2}`;
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
//BOOKMARK AND UNBOOKMARK
router.post("/bookMark", (req, res) => {
  let mysql;
  if (req.body.toBookMark) {
    mysql = `insert into bookmark (member, article ) values ( ${req.body.member}, ${req.body.article} )`;
  } else {
    mysql = `delete from bookmark where member = ${req.body.member} and article = ${req.body.article}`;
  }
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
//FOLLOW AND UNFOLLOW
router.post("/follow", (req, res) => {
  let mysql;
  if (req.body.toFollow) {
    mysql = `insert into follows (member, member_following ) values ( ${req.body.member}, ${req.body.member_following} )`;
  } else {
    mysql = `delete from follows where member = ${req.body.member} and member_following = ${req.body.member_following}`;
  }
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
//My Stuff Screen
router.put("/myStuff", (req, res) => {
  let mysql1 = `select b.id as bookMarkId, b.member, b.article as articleId2, a.id as articleId, a.member as writtenBy, a.member_name as authorName, a.title, a.coverImgID from bookmark b, articles a where b.member = '${req.body.memberId}' and b.article = a.id order by b.createdAt desc`;
  let mysql2 = `select f.id as followingId, f.member as mySelf, f.member_following as following, f.createdAt as since, m.name, m.tags as tags, m.avatar from follows f, members m where f.member = '${req.body.memberId}' and f.member_following = m.id order by m.name`;
  let mysql3 = `select id, title, isDraft, claps, createdAt, coverImgID, articleImages from articles where member = '${req.body.memberId}' order by createdAt desc`;
  let mysql4 = `select * from tags order by tag`;
  let mysql5 = `select f.id as followingId, f.member as mySelf, f.member_following as following, f.createdAt as since, m.name, m.tags as tags, m.avatar from follows f, members m where f.member_following = '${req.body.memberId}' and f.member = m.id order by m.name`;
  let mysql6 = `select tags from members where id = ${req.body.memberId}`;
  let mysql7 = `select * from members where id = ${req.body.memberId}`;

  // let mysql5 = `select tags from members where order by tag`;
  let mysql = `${mysql1};${mysql2};${mysql3};${mysql4};${mysql5};${mysql6};${mysql7}`;
  // res.json({AWESOME: "It Kinda Works!!"})
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

// I AM HERE
//REMOVE BOOKMARK
router.put("/removeBookmark", (req, res) => {
  let mysql = `delete from bookmark where id = ${req.body.id}`;
  // res.json({AWESOME: "It Kinda Works!!"})
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

//UNFOLLOW
router.put("/unfollow", (req, res) => {
  let mysql = `delete from follows where id = ${req.body.id}`;
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

//CREATE A NEW MEMBER
router.post("/createMember", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let mobile = req.body.mobile;
  let finalPassword = bcrypt.hash(password, saltRounds, function (err, hash) {
    let mysql1 = `insert into members (name, email, password, mobile) values ('${name}', '${email}', '${hash}', '${mobile}')`;
    let mysql2 = `select * from members where email = '${email}'`;
    let mysql = `${mysql1};${mysql2}`;
    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        resizeBy.send("Error with connection");
      }
      connection.query(mysql, function (error, result) {
        if (error) throw error;
        let userJson = {
          id: result[1][0].id,
          name: result[1][0].name,
          email: result[1][0].email,
          paidMember: result[1][0].paidMember,
          memberExpires: result[1][0].expires,
        };
        res.json({
          member: userJson,
          token: jwtSignUser(userJson),
        });
      });
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        let firstName = result[1][0].name;
        let email = result[1][0].email;
        let message = `This is anew subscriber`;
        let subject = `New Member`;
        let recipient = "waynebruton@icloud.com";
        let mailError;

        const output = `
                      <p>You have a Subscriber</p>
                      <h3>Contact Details</h3>
                      <ul>
                        <li>First Name: ${firstName}</li><br>

                        <li>Email: ${email}</li><br>
                      </ul><br>
                      <h3>Message</h3><br>
                      <p style="background-color: purple; padding: 15px 15px; color: white;">${message}</p>
                        `;
        sendMail(subject, recipient, output)
          .then(async function () {
            if (mailError) {
       
            } else {
         
            }
          })
          .catch(async function (error) {
            console.log(error);
           
          });
          // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
          // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
          // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
          // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
     
    

      connection.release();
    });
  });
});

//EDIT MEMBER DETAILS
router.put("/editMember", checktoken, (req, res) => {
  // res.json({Awesome: "It works!!!"})
  let mysql = `update members set website = "${req.body.website}", avatar = "${req.body.avatar}", tags = '${req.body.tags}', showEmail = ${req.body.showEmail}, aboutMember = "${req.body.aboutMember}" where id = ${req.body.id}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(mysql, function (error, result) {
      if (error) throw error;
      res.json({ success: true });
    });
    connection.release();
  });
});

//RESET PASSWORD TOKEN
router.put("/resetPasswordToken", (req, res) => {
  let mysql = `select * from members where email = '${req.body.email}'`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      res.json({ error: "Error with connection. Are you online?" });
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        res.json({ error: "No such user" });
      } else {
        if (!result.length) {
          res.json({
            error: `No user registered under "${req.body.email}", try signup and register as a user.`,
          });
        } else {
          console.log("RESULT", result[0].mobile);
          let tokenA = totp.generate(otp_secret);
          let smstoken = process.env.SMSToken;
          params = {
            to: `${result[0].mobile}`,
            body: `Here is your One Time Pin for TwoTruths
                    => ${tokenA} <=`,
          };

          axios.defaults.headers.post["Authorization"] = `${smstoken}`; // for POST requests
          // await
          let resultA = axios
            .post("https://api.bulksms.com/v1/messages", params)
            .then((result) => {
              smsResult = result.status;
              console.log("The RESULT", result.status);
              // let data = {
              //   result: smsResult,
              //   OTP: otp,
              //   status: response.status,
              // };
              res.json({ token: tokenA });
            })
            .catch((error) => {
              // console.log("Status:", error.response.status);

              let data = {
                result: smsResult,
                OTP: otp,
                status: error,
              };
              res.json(data);
            });
        }
      }
    });
    connection.release();
  });
});

//RESET PASSWORD
router.put("/resetPassword", (req, res) => {
  let mysql = `select * from members where email = '${req.body.email}'`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      res.json({ error: "Error with connection. Are you online?" });
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        res.json({ error: "No such user" });
      } else {
        if (!result.length) {
          res.json({
            error: `No user registered under "${req.body.email}", try signup and register as a user.`,
          });
        } else {
          let password = req.body.password;
          let finalPassword = bcrypt.hash(password, saltRounds, function (
            err,
            hash
          ) {
            let mysql2 = `update members set password = '${hash}' where email = '${req.body.email}'`;

            connection.query(mysql2, function (error, result) {
              if (error) {
                res.json({ success: false });
              } else {
                res.json({ success: true });
              }
            });
          });
        }
      }
    });
    connection.release();
  });
});

//LOGIN
router.put("/login", (req, res) => {
  let user_password = req.body.password;
  let hashedPassword = "";
  let mysql = `select * from members where email = '${req.body.email}'`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      res.json({ error: "Error with connection. Are you online?" });
    }
    connection.query(mysql, function (error, result) {
      if (error) {
        res.json({ error: "No such user" });
      } else {
        if (!result.length) {
          res.json({
            error: `No user registered under "${req.body.email}", try signup and register as a user.`,
          });
        } else {
          let hash = result[0].password;
          let userJson = {
            id: result[0].id,
            email: result[0].email,
            avatar: result[0].avatar,
            website: result[0].website,
            username: result[0].name,
            showEmail: result[0].showEmail,
            aboutMember: result[0].aboutMember,
            paidMember: result[0].paidMember,
            memberExpires: result[0].expires,
            isAdmin: result[0].isAdmin
          };
          bcrypt.compare(user_password, hash, function (err, response) {
            if (response) {
              res.json({
                user: userJson,
                token: jwtSignUser(userJson),
              });
            } else {
              res.json({
                error: "Password is incorrect. Please try again",
              });
            }
          });
        }
      }
    });
    connection.release();
  });
});

module.exports = router;
