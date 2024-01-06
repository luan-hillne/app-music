const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var albumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    musics: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Music'
        }
    ],
    description: {
        type: String,
    },
    avatar: {
        type: String,
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'Artist'
    }
});

//Export the model
module.exports = mongoose.model('Album', albumSchema);