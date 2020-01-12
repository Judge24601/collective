var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CollectiveSchema = new Schema({
    title: String,
    summary: String,
    notes: String,
    totalAmount: Number,
    pollChoices: [
        {
            value: String,
            votes: Number
        }
    ],
    posts: [
        {
            id: String
        }
    ],
    users: [
        {
            email: String
        }
    ]
});

module.exports = CollectiveSchema;