var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");
const axios = require("axios");

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

  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("comment")
      .then(function (dbArticles) {
        res.json(dbArticles);
      })
      .catch(function (err) {
        return res.json(err);
      })
  });

  app.put("/save", function (req, res) {
    db.Article.updateOne({ _id: req.body.id }, { $set: { saved: true } })
      .then((updatedArticles) => {
        res.json(updatedArticles);
      })
      .catch(function (err) {
        return res.json(err);
      })
  })

  app.put("/unsave", function (req, res) {
    db.Article.updateOne({ _id: req.body.id }, { $set: { saved: false } })
      .then((updatedArticles) => {
        res.json(updatedArticles);
      })
      .catch(function (err) {
        return res.json(err);
      })
  })

  app.put("/comment/:id", function (req, res) {
    console.log(req.params.id)
    db.Comment.findOneAndUpdate({ _id: req.params.id }, { $set: { title: req.body.title, body: req.body.body } })
      .then((updatedComment) => {
        console.log("line 59: " + updatedComment);
        res.json(updatedComment);
      })
      .catch(function (err) {
        return res.json(err);
      })
  })

  app.post("/articles/:id", function (req, res) {
    db.Comment.create(req.body)
      .then(function (newComment) {
        // View the added result in the console
        console.log(newComment);
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: newComment._id }, { new: true });

      })
      .then(function (addedComment) {
        res.redirect("/");
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });
  })

  app.get("/scrape", function (req, res) {
    // Query: In our database, go to the animals collection, then "find" everything
    const promises = [];

    // //axios.get("http://www.gamespot.com/news/").then(function (response) {

    request("https://www.sciencedaily.com/news/computers_math/video_games/", function (error, response, html) {

      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      //console.log(html);
      var $ = cheerio.load(html);
      let articlesArray = [];
      

      $("h3.latest-head").each(function (i, element) {

        let result = {};

        result.link = "http://www.sciencedaily.com"+ $(element).children('a').attr("href");
        result.title = $(element).text();


        result.summary = $(element).next('.latest-summary').text();

        // Save these results in an object that we'll push into the results array we defined earlier
        if (result.title) {
          articlesArray.push(result);
          //console.log("array of new articles" +articlesArray);
        };
      });
      console.log(articlesArray);
      db.Article.create(articlesArray)
            .then(function (newArticles) {
              console.log(newArticles)
              res.json(newArticles)
            })
            .catch(function (err) {
              // If an error occurred, send it to the client
              return res.json(err);
              //console.error(err);
            })
    })
    // .catch(function (err) {
    //   // If an error occurred, send it to the client
    //   console.log("Axios block" + err);
    //   //console.error(err);
    // })

  });


}