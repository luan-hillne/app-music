const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var musicShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    data: {
        type: Buffer,
        required: true,
    },
    avatar: {
        type: Buffer,
        required: true,
    },
    artist: {
        type: mongoose.Types.ObjectId,
        ref: 'Artist'
    },
    countListen: {
        type: Number,
        default: 600
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    copyright: {
        type: Boolean,
        default: false
    }
});

//Export the model
module.exports = mongoose.model('Music', musicShema);