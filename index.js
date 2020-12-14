const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

// set the view engine to ejs
app.set("view engine", "ejs");

// Routing
app.use(express.static(path.join(__dirname, "public")));

// index page
app.get("/", function (req, res) {
  res.render("pages/index");
});

let userscount = 0;
let regUsers = [];
io.on("connection", (socket) => {
  console.log("new user connection: " + socket.id);

  userscount++;
  console.log("users:" + userscount);
  //regUsers.push(socket.id);

  io.to(socket.id).emit("regAccept", {
    ts: Date.now(),
    msg: socket.id,
    u: socket.id,
  });

  io.to(socket.id).emit("chat", {
    ts: Date.now(),
    msg:
      "You are now registered, as user #" +
      userscount +
      ", your id is " +
      socket.id.substr(0, 6) +
      "",
    u: "SYSTEM",
  });

  socket.broadcast.emit("chat", {
    ts: Date.now(),
    u: "SYSTEM",
    msg: "New User joined just now. Users: " + userscount,
  });

  //io.emit("chat", msg);

  io.emit("users", regUser("add", socket.id));

  socket.on("disconnect", (id) => {
    console.log("user disconnected cc " + socket.id);
    userscount--;
    console.log("users:" + userscount);

    let i = regUsers.indexOf(socket.id);
    regUsers.splice(i, 1);

    socket.broadcast.emit("chat", {
      ts: Date.now(),
      u: "SYSTEM",
      msg: "User just disconnected. Users: " + userscount,
    });
  });

  socket.on("chat", (msg) => {
    console.log("message: " + JSON.stringify(msg));
    //socket.broadcast.emit("chat", msg);
    io.emit("chat", msg);
  });
});

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});

const regUser = (mth = "add", userid) => {
  if (mth == "add") {
    console.log("regUser - ADD new user:" + userid);
    regUsers.push(userid);
    let filtered = regUsers;
  } else {
    console.log("regUser - REMOVE user:" + userid);
    let filtered = regUsers.filter(function (value, index, arr) {
      return value != userid;
    });

    return filtered;
  }
  //var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return regUsers;
};
