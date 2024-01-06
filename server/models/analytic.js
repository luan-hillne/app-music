const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var analyticSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    price: {
        type: Number,
        default: 99.00
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//Export the model
module.exports = mongoose.model('Analytic', analyticSchema);