const jwt = require('jsonwebtoken')

const gennerateAccessToken = (uid, role) => jwt.sign({ _id: uid, vip: role }, process.env.JWT_SECRET, { expiresIn: '1d' })
const gennerateRefreshToken = (uid) => jwt.sign({ _id: uid }, process.env.JWT_SECRET, { expiresIn: '3d' })


module.exports = {
    gennerateAccessToken,
    gennerateRefreshToken
}