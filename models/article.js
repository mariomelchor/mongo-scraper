var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create a new ArticleSchema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false,
    required: true
  },
  // reference to comments
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});
// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);
// Export the Article model
module.exports = Article;