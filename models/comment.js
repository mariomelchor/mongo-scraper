var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create a CommentSchema object
var CommentSchema = new Schema({
  comment: String
});
// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);
// Export the Comment model
module.exports = Comment;