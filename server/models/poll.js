let mongoose = require('mongoose');
var Schema = mongoose.Schema;

let Poll = new Schema({
    topic: String,
    choices: [
        {
            value: String,
            votes: Number
        }
    ]
});

module.exports = Poll;