var bodyParser = require('body-parser')
var cheerio = require("cheerio");
var exphbs  = require('express-handlebars');
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var request = require("request");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "mongoscraper";
var collections = ["articles"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes
app.get("/", function(req, res) {
  res.send("Hello world");
});

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});