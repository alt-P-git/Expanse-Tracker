const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: String,
    email: String,
});

module.exports = mongoose.model('User', userSchema);