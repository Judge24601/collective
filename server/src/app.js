const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
let Pusher = require("pusher");
require("dotenv").config();

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
var PostModel = postConnection.model('Posts', Post);
var CollectiveModel = collectiveConnection.model('Collectives', Collective);
var UserModel = userConnection.model('Users', User);
// This creates a new Customer and attaches the PaymentMethod in one API call.

// Fetch single user
app.get("/user/:email", (req, res) => {
  var db = req.db;
  UserModel.findOne({email: req.params.email}, "", function(error, user) {
    if (error) {
      console.error(error);
    }
    res.send(user);
  })
});

app.put("/user/:email", (req, res) => {
  var db = req.db;
  UserModel.findOne({email: req.params.email}, "", function(error, user) {
    if (error) {
      console.error(error);
    }
    console.log('yis', user)
    user.collective = req.body.collective
    user.save()
  })
  res.send({
    success: true,
    message: "user updated!"
  });
});

app.put("/user/:email/voted", (req, res) => {
  UserModel.findOne({email: req.params.email}, "", function(error, user) {
    if (error) {
      console.log(error);
      return;
    }

    user.voted = req.body.voted;
    user.save();
  })

  res.send({success: true, message: "User updated!"});
})

app.post("/users", async (req,res) => {
  console.log("Hi again");
  var db = req.db;
  var email = req.body.email;
  var payment_method = req.body.payment_method;
  var name = req.body.name;
  console.log("before customer")
  const customer = await stripe.customers.create({
    payment_method: payment_method.id,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method.id,
    },
  });
  console.log("past customer")  
  var customerId = customer.id;

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ plan: "plan_GX4AB0oH5nLgdc" }],
    expand: ["latest_invoice.payment_intent"],
  });
  var monthlyCharge = subscription.plan.amount / 100; 
  console.log("past sub")
  var user = new UserModel({
    name: name,
    email: email,
    customerId: customerId,
    monthlyCharge: monthlyCharge,
    voted: false,
  });

  user.save(function(error){
    if(error) {
      console.log(error);
    }
    res.send({
      success: true,
      message: "New user created!"
    });
  });
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

// Fetch collective data for collective ID
app.get("/collectives/:collectiveId", (req, res) => {
  CollectiveModel.findById(req.params.collectiveId, "", function(error, collective) {
    if (error) {
      res.send('Error');
    }

    res.send(collective);
  });
});

// Add new collective
app.post("/collectives", (req, res) => {
  var title = req.body.title;
  var summary = req.body.summary;
  var notes = req.body.notes;
  var newCharge = req.body.monthlyCharge;
  var new_collective = new CollectiveModel({
    title: title,
    summary: summary,
    notes: notes,
    totalAmount: newCharge,
    poll: { choices: [] }, 
    posts: [],
    users: []
    //replies: [{id: "abc123"}]
  });
  console.log(totalAmount)
  new_collective.save(function(error) {
    if (error) {
      console.log(error);
    }
    res.send({
      success: true,
      message: new_collective.id
    });
  });
});

// Fetch all collectives 
app.get("/collectives", (req, res) => {
  console.log("got here")
  CollectiveModel.find({}, "", function(error, collectives) {
    if (error) {
      console.error(error);
    }
    res.send({
      collectives: collectives
    });
  }).sort({_id: -1});
});

// Fetch one collective 
app.get("/collective/:id", (req,res) =>{
  var db = req.db;
  CollectiveModel.findById(req.params.id, "", function(error, post) {
    if (error) {
      console.error(error);
    }
    res.send(collective);
  });
});

// Update a collective

app.put("/collective/:id", (req,res) => {
  var db = req.db;
  CollectiveModel.findById(req.params.id, "title summary notes totalAmount", function(error, collective) {
    if (error) {
      console.error(error);
    }
    console.log('heyyyyy', req.body)
    if (collective.totalAmount == undefined) {
      collective.totalAmount = 0
    }
    collective.totalAmount = req.body.totalAmount + collective.totalAmount;
    console.log(collective.totalAmount)
    collective.save(function(error) {
      if (error) {
        console.log(error);
      }
      res.send({
        success: true
      });
    });
  });

})

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

// Increment poll option
app.post("/collectives/:collectiveId/vote", (req, res) => {
  const choice = req.body.choice;
  console.log('here');
  CollectiveModel.findById(req.params.collectiveId, function(error, collective) {
    console.log('Found collective: ' + collective.title + ' votes: ' + collective.pollChoices[0].votes + " choice: " + choice);
    collective.pollChoices[choice].votes++;
    collective.save();

    let pusher = new Pusher({
      appId: process.env.app_id,
      key: process.env.key,
      secret: process.env.secret,
      cluster: process.env.cluster
    });

    let payload = { collectiveId: req.params.collectiveId, choice: choice };
    pusher.trigger( req.params.collectiveId, 'vote', payload, req.body.socketId)

    res.send('Success');
  });

  /*
  CollectiveModel.update({_id: req.params.collectiveId}, {$inc: {[identifier]: 1}}, {}, (err, numberAffected) => {
      res.send('Success');
  });*/
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
