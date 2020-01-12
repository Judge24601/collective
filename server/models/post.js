var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  id: Number,
  title: String,
  description: String
});

var Post = mongoose.model("Post", UserSchema);
module.exports = Post;
