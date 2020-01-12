var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: String,
  description: String,
  userEmail: String,
  collectiveId: String,
  parentPostId: String,
  replies: [
    {
      id: String
    }
  ]
});

module.exports = PostSchema;
