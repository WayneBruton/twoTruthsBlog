const express = require("express");
const app = express();
// var http = require('http').createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// const readtime = require("estimated-read-time");
// const faker = require("faker");

// let result = faker.lorem.paragraphs(nb=10);

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

if (port === 3000) {
  const dotenv = require("dotenv").config();
}

// io.on("connection", () => {
//   console.log("there is a connection")
// })

app.use(express.static(path.join(__dirname, "public")));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const initialRoutes = require("./routes/initialRoutes"),
  memberRoutes = require("./routes/memberRoutes"),
  imageRoutes = require("./routes/imageRoutes"),
  articleRoutes = require("./routes/articleRoutes"),
  contactRoutes = require("./routes/contactRoutes"),
  paymentRoutes = require("./routes/paymentRoutes"),
  adminRoutes = require("./routes/adminRoutes");

app.use(
  initialRoutes,
  memberRoutes,
  imageRoutes,
  articleRoutes,
  contactRoutes,
  paymentRoutes,
  adminRoutes
);

const server = app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

//APP.JS
const io = require("socket.io")(server);
let members = [];
let users = {};
io.on("connection", function (socket) {
  console.log("Connected", socket.id);
  // console.log("members", members);
  socket.on("NEW_USER", function (data) {
    if (data.user in users) {
      socket.nickname = data.user;
      users[socket.nickname] = socket;
      let user = {
        nickname: users[socket.nickname].nickname,
        id: users[socket.nickname].id,
      };
      let exists = members.filter((el) => {
        return el.nickname === data.user;
      });
      if (!exists.length) {
        members.push(user);
      } else {
        console.log("user exists", data.user);
      }
      // console.log(members);
    } else {
      socket.nickname = data.user;
      users[socket.nickname] = socket;
      let user = {
        nickname: users[socket.nickname].nickname,
        id: users[socket.nickname].id,
      };
      members.push(user);
    }
    let loggedOnUsers = [];
    members.forEach((el) => {
      loggedOnUsers.push(el.nickname);
    });
    users[data.user].emit("USERS", loggedOnUsers);
    // console.log("members", members);
  });
  // socket.on("USERS", function (data) {
  //   let loggedOnUsers = []
  //   members.forEach((el) => {
  //     loggedOnUsers.push(el.nickname)
  //   })
  //   users[data.user].emit('USERS', loggedOnUsers)
  //   console.log("members", members);

  // })
  socket.on("SEND_MESSAGE", function (data) {
    var messageTo = data.messageTo;
    // console.log("MessageTo", messageTo);
    // console.log(data);
    let member = members.filter((el) => {
      return el.nickname === messageTo;
    });
    if (member.length > 0) {
      users[messageTo].emit("MESSAGE", data);
      users[data.user].emit("MESSAGE", data);
      // console.log("OK it worked");
      // console.log("members", members);
    } else {
      // console.log("OOPs");
      data.message = `User has left the chat`;
      users[data.user].emit("MESSAGE", data);
    }
    // console.log("The message is to", member, messageTo);
  });
  socket.on("EXIT", function (data) {
    // console.log("DATA", data);
    members = members.filter((el) => {
      return el.nickname !== data.user;
    });
    // socket.disconnect()
  });
  socket.on("typing", (data) => {
    if (data.typing == true) {
      users[data.messageTo].emit("display", data);
    } else {
      users[messageTo].emit("display", data);
    }
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected with id:", socket.id, socket.nickname);
    // console.log(socket.id);
    // console.log(socket.nickname);
    members = members.filter((el) => {
      return el.id !== socket.id;
    });
    delete socket;
    // console.log("members after disconnect", members);
  });
});

// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
