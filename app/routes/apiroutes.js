var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require("mongoose");

const request = require("request");
const cheerio = require("cheerio");

var db = require("../models");

var app = express();

module.exports = function (app) {
  app.get("/articles", function (req, res) {
    db.Article.find({})
      .then(function (dbArticles) {
        res.json(dbArticles);
      })
      .catch(function (err) {
        return res.json(err);
      })
  });

  app.put("/save", function (req, res) {
    db.Article.updateOne({ _id: req.body.id }, { $set: { saved: true } })
    .then((updatedArticles)=> {
      res.json(updatedArticles);
    })
    .catch(function (err) {
      return res.json(err);
    })
  })

  app.put("/unsave", function (req, res) {
    db.Article.updateOne({ _id: req.body.id }, { $set: { saved: false } })
    .then((updatedArticles)=> {
      res.json(updatedArticles);
    })
    .catch(function (err) {
      return res.json(err);
    })
  })

  app.get("/scrape", function (req, res) {
    // Query: In our database, go to the animals collection, then "find" everything

    request("http://www.gamespot.com/news/", function (error, response, html) {

      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);

      // Select each element in the HTML body from which you want information.
      // NOTE: Cheerio selectors function similarly to jQuery's selectors,
      // but be sure to visit the package's npm page to see how it works
      $("a.js-event-tracking").each(function (i, element) {

        let result = {};

        result.link = "http://www.gamespot.com" + $(element).attr("href");
        result.title = $(element).data('event-title')
        result.summary = $(element).children("div").children('p').text();



        // Save these results in an object that we'll push into the results array we defined earlier
        if (result.title) {
          db.Article.create(result)
            .then(function (newArticle) {
              console.log(newArticle)
            })
            .catch(function (err) {
              // If an error occurred, send it to the client
              return res.json(err);;
            })
        };
      });
    });
    res.redirect('/');
  });
}