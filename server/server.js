const express = require('express')
const dbConnect = require('./configs/connDB')
const cookie = require('cookie-parser')
const initWebRoutes = require('./routes')
const cors = require('cors')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 8888
app.use(cors())
app.use(cookie())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
initWebRoutes(app)

// Run server
app.listen(port, (err) => {
    if (!err) {
        console.log('Server is running on the port: ' + port)
        dbConnect()
    } else {
        console.log('Server not fine')
    }
})