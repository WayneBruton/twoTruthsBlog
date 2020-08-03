const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
var cloudinary = require("cloudinary").v2;

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

  //MULTER FILE FILTER
const fileFilter = function (req, file, cb) {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Wrong file type");
      error.code = "LIMIT_FILE_TYPES";
      return cb(error, false);
    }
    cb(null, true);
  };
  
  let MAX_SIZE = 20000000;
  const upload = multer({
    dest: "./public/uploads/",
    // dest: `${process.env.DRAFT_INITIAL_UPLOADS}`,
    fileFilter,
    limits: {
      fileSize: MAX_SIZE,
      fieldSize: 100 * 1024 * 1024,
    },
  });

  // CLOUDINARY CONFIG - STICK THIS IN ENV FILE
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  //IMAGE REMOVE
router.post("/removeImage", (req, res) => {
    res.json({ Awesome: "It works" });
    cloudinary.uploader.destroy(`${req.body.url_id}`, function (result, error) {
      console.log(result), console.log(error);
    });
  });
  //REMOVE PROFILE IMAGE
  router.post("/removeProfileImage", (req, res) => {
    res.json({ Awesome: "It works" });
    cloudinary.uploader.destroy(`${req.body.profileId}`, function (
      result,
      error
    ) {
      console.log(result), console.log(error);
    });
  });

  //UPLOAD IMAGE INSIDE ARTICLE
router.post("/uploadImageInEditor", upload.single("image"), (req, res) => {
    let thisMimeType = req.file.mimetype.split("/")[1];
    let filename = req.file.filename;
    let path = `public/uploads/${filename}`;
    let responseToApp;
    cloudinary.uploader.upload(`${path}`, function (error, result) {
      responseToApp = { url: result.secure_url, url_id: result.public_id };
      res.json(responseToApp);
      console.log(result), console.log(error);
    });
    fs.unlink(path, function (err) {
      if (err) throw err;
      console.log("File Deleted!!");
    });
  });

  //UPLOAD COVER IMAGE OF ARTICLE
router.post("/uploadCoverImage", upload.single("file"), (req, res) => {
  
    let thisMimeType = req.file.mimetype.split("/")[1];
    let filename = req.file.filename;
    let path = `public/uploads/${filename}`;
    let responseToApp;
    try {
      cloudinary.uploader.upload(`${path}`, function (error, result) {
        responseToApp = { url: result.secure_url, url_id: result.public_id };
        res.json(responseToApp);
        console.log(result), console.log(error);
      });
    } catch (e) {
      res.json({ Error: "There was an error" });
    }
    fs.unlink(path, function (err) {
      if (err) throw err;
      console.log("File Deleted!!");
    });
  });

  module.exports = router;