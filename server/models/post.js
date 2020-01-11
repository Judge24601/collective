var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  id: Number,
  title: String,
  description: String
});

var Post = mongoose.model("Post", PostSchema);
module.exports = Post;
