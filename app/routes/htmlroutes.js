const express = require("express");
var db = require("../models");
var mongoose = require("mongoose");
var path = require("path");

// Routes
// =============================================================
module.exports = function (app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  //have to use res.render for handlebars
  app.get("/", function (req, res) {
    db.Article.find({})
      .then(function (dbArticles) {
        console.log(dbArticles);
        res.render("index", {dbArticles});
      })
      .catch(function (err) {
        return res.json(err);
      })
    
    // res.sendFile(path.join(__dirname, "../public/assets/index.html"));
  });

  app.get("/recipe", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/assets/newrecipe.html"));
  });

  app.get("/app/public/assets/css/style.css", function (req, res) {
    res.sendFile(process.cwd() + "/app/public/assets/css/" + "style.css");
  });

  // app.get("/app/public/assets/css/animate.css", function (req, res) {
  //   res.sendFile(process.cwd() + "/app/public/assets/css/" + "animate.css");
  // });

  app.get("../../public/assets/js/main.js", function (req, res) {
    res.sendFile(process.cwd() + "/app/public/assets/" + "main.js");
  });
  // app.get("/app/public/assets/js/jquery.waypoints.js", function (req, res) {
  //   res.sendFile(process.cwd() + "/app/public/assets/js/" + "jquery.waypoints.js");
  // });

};