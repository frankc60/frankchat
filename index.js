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

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat", (msg) => {
    console.log("message: " + msg);
  });
});

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});
