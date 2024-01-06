const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcryptjs')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    account: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    vip: {
        type: Number,
        default: 0 //
    },
    refreshToken: {
        type: String,
        default: null
    },
    otp: {
        type: String,
        default: null
    },
    otpTimestemp: {
        type: Date,
        default: null
    },
    avatar: {
        type: Buffer,
    },
    avatarDefault: {
        type: String,
        default: 'https://png.pngtree.com/png-vector/20191026/ourlarge/pngtree-avatar-vector-icon-white-background-png-image_1870181.jpg'
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next()
    this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(10))
})

//Export the model
module.exports = mongoose.model('User', userSchema);