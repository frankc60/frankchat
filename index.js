const express = require("express");
const ejs = require("ejs");

var app = express();

// set the view engine to ejs
app.set("view engine", "ejs");

// use res.render to load up an ejs view file

// index page
app.get("/", function (req, res) {
  res.render("pages/index");
});

app.listen(8080);
console.log("8080 is the magic portx");
