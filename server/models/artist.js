const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: Buffer,
        default: null
    },
    avatarDefault: {
        type: String,
        default: 'https://d2oet5a29f64lj.cloudfront.net/img-data/w/2480/highlighted%20composers/dev_BluesSaraceno2.jpg.webp'
    },
    dateOfBirth: {
        type: String,
    },
    dateOfDeath: {
        type: String,
    },
    bio: {
        type: String,
        require: true
    },
    thumbnail: {
        type: Buffer
    },
    thumbnailDefault: {
        type: String,
        default: 'https://cdn.artlist.io/artlist-images/727416_SOURWAH_Cover_-_C2_-_2.5K.jpg'
    }
});

//Export the model
module.exports = mongoose.model('Artist', artistSchema);