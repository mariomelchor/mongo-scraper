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
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoscraper";
mongoose.connect("mongodb://heroku_vx16xnk2:346cf9dt78u3nsq49d4kkijafs@ds025439.mlab.com:25439/heroku_vx16xnk2", {
  useMongoClient: true
});

// Routes
app.get("/", function(req, res) {
  db.Article
  .find({saved: false})
  .then(function(dbArticle) {
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

// Route for saving an article
app.put("/save/:id", function(req, res) {
  db.Article
  .findOneAndUpdate({ _id: req.params.id }, { saved: true })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for unsaving an article
app.put("/unsave/:id", function(req, res) {
  db.Article
  .findOneAndUpdate({ _id: req.params.id }, { saved: false })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for all saved articles
app.get("/saved", function(req, res) {
  db.Article
  .find({ saved: true })
  .then(function(dbArticle) {
    res.render('saved', { articles: dbArticle } );
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});