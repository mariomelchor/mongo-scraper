var bodyParser = require('body-parser')
var cheerio    = require("cheerio");
var exphbs     = require('express-handlebars');
var express    = require("express");
var mongoose   = require("mongoose");
var request    = require("request");
var PORT       = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoscraper";

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
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
        // res.json(err);
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

// Route for saving/updating an Article's associated comments
app.post("/comments/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry

  db.Comment
    .create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: dbComment._id } }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's comments
app.get("/articles/:id", function(req, res) {
  db.Article
    .findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for removing an comment
app.put("/comments/remove/:id", function(req, res) {
  db.Comment
  .findOneAndRemove({ _id: req.params.id })
  .then(function(dbComment) {
    res.json(dbComment);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Set the app to listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port 3000!");
});