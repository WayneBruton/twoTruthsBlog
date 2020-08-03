const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
// const readtime = require("estimated-read-time");
// const faker = require("faker");


// let result = faker.lorem.paragraphs(nb=10);

app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

if (port === 3000) {
  const dotenv = require("dotenv").config();
}

app.use(express.static(path.join(__dirname, "public")));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const initialRoutes = require("./routes/initialRoutes"),
      memberRoutes = require("./routes/memberRoutes"),
      imageRoutes = require("./routes/imageRoutes"),
      articleRoutes = require("./routes/articleRoutes");

app.use(initialRoutes, memberRoutes, imageRoutes, articleRoutes)

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });