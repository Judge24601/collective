const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");

var Post = require("../models/post");
var Collective = require("../models/collective");
var User = require("../models/user");
//var Poll = require("../models/poll");
const app = express();
const stripe = require('stripe')('sk_test_tcmBJCQxZTDZxbo6Y9C4F6HX00qnugoRlW');
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

var postConnection = mongoose.createConnection("mongodb://localhost:27017/posts");
var collectiveConnection = mongoose.createConnection("mongodb://localhost:27017/collectives")
var userConnection = mongoose.createConnection("mongodb://localhost:27017/users");
//var pollConnection = mongoose.createConnection("mongodb://localhost:27017/polls");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback) { 
  console.log("Connection Succeeded");
});

// This creates a new Customer and attaches the PaymentMethod in one API call.
const customer = await stripe.customers.create({
  payment_method: 'pm_1FU2bgBF6ERF9jhEQvwnA7sX',
  email: 'jenny.rosen@example.com',
  invoice_settings: {
    default_payment_method: 'pm_1FU2bgBF6ERF9jhEQvwnA7sX',
  },
});

const subscription = await stripe.subscriptions.create({
  customer: "cus_G02hIo15n8CU1s",
  items: [{ plan: "plan_FSDjyHWis0QVwl" }],
  expand: ["latest_invoice.payment_intent"]
});

// Add new post
app.post("/posts", (req, res) => {
  var db = req.db;
  var title = req.body.title;
  var description = req.body.description;
  var userEmail = req.body.userEmail;
  var collectiveId = req.body.collectiveId;
  var parentPostId = req.body.parentPostId;
  var new_post = new PostModel({
    title: title,
    description: description,
    userEmail: userEmail,
    collectiveId: collectiveId,
    parentPostId: parentPostId,
    replies: []
    //replies: [{id: "abc123"}]
  });

  new_post.save(function(error) {
    if (error) {
      console.log(error);
    }
    res.send({
      success: true,
      message: "Post saved successfully!"
    });
  });
});

// Fetch all posts
app.get("/posts", (req, res) => {
  PostModel.find({}, "", function(error, posts) {
    if (error) {
      console.error(error);
    }
    res.send({
      posts: posts
    });
  }).sort({ _id: -1 });
});

// Fetch posts for specific collective with no replies (parent posts)
app.get("/posts/:collectiveId", (req, res) => {
  PostModel.find({collectiveId: req.params.collectiveId, parentPostId: {$eq: null}}, "", function(error, posts) {
    if (error) {
      console.error(error);
    }
    res.send({
      posts: posts
    });
  }).sort({ _id: -1 });
});

// Add new collective
app.post("/collectives", (req, res) => {
  var title = req.body.title;
  var summary = req.body.summary;
  var notes = req.body.notes;
  var new_collective = new CollectiveModel({
    title: title,
    summary: summary,
    notes: notes,
    poll: { choices: [] }, 
    posts: [],
    users: []
    //replies: [{id: "abc123"}]
  });

  new_collective.save(function(error) {
    if (error) {
      console.log(error);
    }
    res.send({
      success: true,
      message: "Post saved successfully!"
    });
  });
});

// Post new poll option
app.post("/collectives/:collectiveId", (req, res) => {
  var pollOption = req.body.pollOption;
  var collectiveId = req.params.collectiveId
  //CollectiveModel.findByIdAndUpdate(collectiveId, {$push: {pollChoices: {values: pollOption, votes: 0}}});
  console.log("Poll option: " + pollOption + " collectiveId: " + collectiveId);

  //CollectiveModel.update( {_id: collectiveId}, {$push: {pollChoices: {value: pollOption, votes: 0}}}, done);

  CollectiveModel.findById(collectiveId, function(error, collective) {
    console.log('Found collective: ' + collective.title);
    collective.pollChoices.push({value: pollOption, votes: 0});
    collective.save();
  });

  res.send({
    success: true,
    message: "Added poll option"
  })
});

// Untested endpoints

// Fetch single post
app.get("/post/:id", (req, res) => {
  var db = req.db;
  PostModel.findById(req.params.id, "", function(error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post);
  });
});

// Update a post
app.put("/posts/:id", (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, "title description", function(error, post) {
    if (error) {
      console.error(error);
    }

    post.title = req.body.title;
    post.description = req.body.description;
    post.save(function(error) {
      if (error) {
        console.log(error);
      }
      res.send({
        success: true
      });
    });
  });
});

// Delete a post
app.delete("/posts/:id", (req, res) => {
  var db = req.db;
  Post.remove(
    {
      _id: req.params.id
    },
    function(err, post) {
      if (err) res.send(err);
      res.send({
        success: true
      });
    }
  );
});

// Fetch all polls
app.get("/polls", (req, res) => {
  pollModel.find({}, "", function(error, polls) {
    if (error) {
      console.error(error);
    }
    res.send({
      polls: polls
    });
  }).sort({ _id: -1 });
});

app.listen(process.env.PORT || 8081);
