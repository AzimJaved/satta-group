const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: String, 
    players: [],
    currScore : Number,
    cumScore : Number
});


module.exports.User = mongoose.model('User', userSchema)