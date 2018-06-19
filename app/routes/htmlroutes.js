const express = require("express");
var db = require("../models");
var mongoose = require("mongoose");
var path = require("path");

// Routes
// =============================================================
module.exports = function (app) {

  //get all articles populated with comments if they exist
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

  //view saved articles
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

  app.get("/app/public/assets/img/sd-logo.png", function (req, res) {
    res.sendFile(process.cwd() + "/app/public/assets/img/sd-logo.png");
  });

  app.get("/app/public/assets/js/main.js", function (req, res) {
    res.sendFile(process.cwd() + "/app/public/assets/js/main.js");
  });
};