var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

const mongojs = require("mongojs");
const request = require("request");
const cheerio = require("cheerio");

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/all", function(req, res) {
    // Query: In our database, go to the animals collection, then "find" everything
    db.scrapedData.find({}, function(error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log(error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
  });