var bodyParser = require('body-parser')
var cheerio    = require("cheerio");
var exphbs     = require('express-handlebars');
var express    = require("express");
var mongoose   = require("mongoose");
var request    = require("request");

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoscraper", {
  useMongoClient: true
});

// Routes
app.get("/", function(req, res) {
  db.Article
  .find({})
  .then(function(dbArticle) {
    // If we were able to successfully find Articles, send them back to the client
    // res.json(dbArticle);
    res.render('index', { articles: dbArticle } );
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  db.Article
  .find({})
  .then(function(dbArticle) {
    // If we were able to successfully find Articles, send them back to the client
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

// Scrape data and place it into the mongodb
app.get("/scrape", function(req, res) {
  request("http://www.ocregister.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $(".article-title").each(function(i, element) {
      // Crete an empty object
      var articleObj = {};

      // Save the title and href of each item in the current element
      articleObj.title = $(element).attr("title");
      articleObj.link = $(element).attr("href");

      // Insert the data in the articles collection
      db.Article
      .create(articleObj)
      .then(function(dbArticle) {
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });

    });

    res.redirect("/");
    
  });
});

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});