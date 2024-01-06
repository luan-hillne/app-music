const jsonwebtoken = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyToken = asyncHandler(async (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization?.split(' ')[1]
        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    mes: err.message
                })
            }
            req.user = user
            next()
        })
    } else {
        return res.status(401).json({
            success: false,
            mes: 'Require authentication!'
        })
    }
})
const isAdmin = (req, res, next) => {
    const { vip } = req.user
    if (+vip !== 2) throw new Error('Require Admin Role')
    next()
}
const isVip = (req, res, next) => {
    const { vip } = req.user
    if (+vip === 0) throw new Error('Require Admin Role')
    next()
}
module.exports = {
    verifyToken,
    isAdmin,
    isVip
}