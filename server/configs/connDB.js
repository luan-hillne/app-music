const { default: mongoose } = require('mongoose')// ket noi den database mongodb
mongoose.set('strictQuery', false);

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('DB connected successfully!');
    } catch (error) {
        console.log('DB connection failed!')
        throw new Error(error)
    }
}

module.exports = dbConnect