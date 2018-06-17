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
    .populate("comment")
      .then(function (dbArticles) {
        res.render("index", { dbArticles });
      })
      .catch(function (err) {
        return res.json(err);
      })
  });

  app.get("/saved", function (req, res) {
    db.Article.find({saved: true})
    .populate("comment")
      .then(function (dbArticles) {
        res.render("saved", { dbArticles });
      })
      .catch(function (err) {
        return res.json(err);
      })
  });


  app.get("/app/public/assets/css/style.css", function (req, res) {
    res.sendFile(process.cwd() + "/app/public/assets/css/" + "style.css");
  });

  app.get("/app/public/assets/img/gamespot-logo.png", function (req, res) {
    res.sendFile(process.cwd() + "/app/public/assets/img/gamespot-logo.png");
  });

  app.get("/app/public/assets/js/main.js", function (req, res) {
    res.sendFile(process.cwd() + "/app/public/assets/js/main.js");
  });
};