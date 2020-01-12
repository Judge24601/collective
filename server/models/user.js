var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: String,
    customerId: String,
    collective: String,
    monthlyCharge: Number,
    voted: Boolean,
    posts: [
        {
            id: String
        }
    ]
});

module.exports = UserSchema;