const mongoose = require('mongoose')

var authSchema = {
    token: String,
    date: Date,
    valid: Boolean
}

module.exports.Auth = mongoose.model('Auth', authSchema)