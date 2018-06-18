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
    let testArt = {
      link: "http://www.gamestop.com/news",
      title: "This is a test article",
      summary: "Summary to see if mongodb connection is working properly"
    };

    db.Article.create(testArt)
      .then(function (newArticle) {
        console.log(newArticle)
        //promises.push(promise);
        res.json(newArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        return res.json(err);
        //console.error(err);
      })




    // request("http://www.gamespot.com/news/", function (error, response, html) {
    // //axios.get("http://www.gamespot.com/news/").then(function (response) {


    //   // Load the HTML into cheerio and save it to a variable
    //   // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    //   var $ = cheerio.load(html);

    //   $("a.js-event-tracking").each(function (i, element) {

    //     let result = {};

    //     result.link = "http://www.gamespot.com" + $(element).attr("href");
    //     result.title = $(element).data('event-title')
    //     result.summary = $(element).children("div").children('p').text();

    //     // Save these results in an object that we'll push into the results array we defined earlier
    //     if (result.title) {
    //       const promise = db.Article.create(result)
    //         .then(function (newArticle) {
    //           console.log(newArticle)
    //           promises.push(promise);

    //         })
    //         .catch(function (err) {
    //           // If an error occurred, send it to the client
    //           return res.json(err);
    //           //console.error(err);
    //         })
    //     };
    //   });
    //   Promise.all(promises).then(function(data){
    //     res.send("Article db entries created");
    //    })
    // })
    // .catch(function (err) {
    //   // If an error occurred, send it to the client
    //   console.log("Axios block" + err);
    //   //console.error(err);
    // })

  });


}