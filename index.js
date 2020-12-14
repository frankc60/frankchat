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
  regUsers.push(socket.id);

  io.to(socket.id).emit("regAccept", {
    ts: Date.now(),
    msg: socket.id,
    u: socket.id,
  });

  io.to(socket.id).emit("chat", {
    ts: Date.now(),
    msg: "You are now registered, your id is " + socket.id + "",
    u: "SYSTEM",
  });

  socket.broadcast.emit("chat", {
    ts: Date.now(),
    u: "GOD",
    msg: "New User joined just now. Users: " + userscount,
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userscount--;
    console.log("users:" + userscount);
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
