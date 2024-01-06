const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const { Binary } = require('mongodb');
const { gennerateAccessToken, gennerateRefreshToken } = require('../middlewares/jwt')
const { accountType } = require('../middlewares/account_type')
const jsonwebtoken = require('jsonwebtoken')
const otplib = require('otplib')
const nodemailer = require('nodemailer')
const client = require('twilio')

const register = asyncHandler(async (req, res) => {
    const { account, password, name } = req.body
    if (!account || !password || !name) throw new Error('Missing inputs')
    const response = await User.findOne({ account })
    if (response) {
        throw new Error('User has existed!')
    } else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? 'Register done! Please go login' : 'Something went wrong'
        })
    }
})

const login = asyncHandler(async (req, res) => {
    const { account, password } = req.body
    if (!account || !password) throw new Error('Missing inputs')
    const response = await User.findOne({ account })
    if (!response) {
        throw new Error('Cant find the account')
    } else {
        const correctPassword = bcrypt.compareSync(password, response.password)
        if (!correctPassword) throw new Error('Wrong password')
        const accessToken = gennerateAccessToken(response._id, response.vip)
        const refreshToken = gennerateRefreshToken(response._id)
        response.refreshToken = refreshToken
        await response.save()
        return res.status(200).json({
            success: refreshToken ? true : false,
            accessToken: accessToken ? 'Bearer ' + accessToken : null,
            refreshToken: refreshToken || null,
        })
    }
})

const update = asyncHandler(async (req, res) => {
    const { name, password, address } = req.body
    const user = await User.findById(req.user._id)
    const buffer = req.file?.buffer || null
    const binaryData = new Binary(buffer)

    user.name = name || user.name
    user.password = password || user.password
    user.address = address || user.address
    if (buffer) user.avatar = binaryData

    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mess: 'Update successfully'
    })
})

const get = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('name vip avatar')
    return res.status(200).json({
        success: user ? true : false,
        mess: user
    })
})

const refreshToken = asyncHandler(async (req, res) => {
    if (!req.body.token) throw new Error('Token is required')
    const id = jsonwebtoken.verify(req.body.token, process.env.JWT_SECRET, (err, user) => {
        if (err) throw new Error(err.message)
        return user
    })
    const user = await User.findById(id)
    if (!user) throw new Error('Can not find user id')
    const accessToken = gennerateAccessToken(user._id, user.vip)
    return res.status(200).json({
        success: user ? true : false,
        accessToken: user ? 'Bearer ' + accessToken : null,
        refreshToken: req.body.token
    })
})


const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { account } = req.body
    const otp = otplib.totp.generate(process.env.OTP_SECRET)
    const otpTimestemp = new Date(Date.now() + (+process.env.OTP_EXPIRETIME) * 1000)
    const user = await User.findOne({ account })
    if (!user) throw new Error('Can not find account')
    user.otp = otp
    user.otpTimestemp = otpTimestemp
    const account_type = accountType(account)
    if (account_type === 'gmail') {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: account,
            subject: `OTP Verification from ${process.env.APP}`,
            text: `Your OTP is ${otp}. OTP is expired in ${process.env.OTP_EXPIRETIME} second`
        }
        await transporter.sendMail(mailOptions)
    } else if (account_type === 'phone') {
        await client(process.env.TWILIO_SID, process.env.TWILIO_TOKEN).messages.create({
            body: `Your OTP is ${otp}. OTP is expired in ${process.env.OTP_EXPIRETIME} second`,
            messagingServiceSid: 'MGe855ea039472acda515c30370448298f',
            to: '+84' + account.slice(1)
        })
    }
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        account: account,
        type: account_type
    })
})

const forgotPasswordVerify = asyncHandler(async (req, res) => {
    const { otp, newPassword, account } = req.body
    if (!account || !otp || !newPassword) throw new Error('missing input')
    const user = await User.findOne({ account })
    const isValid = (otp === user?.otp)
    const isExpired = new Date() > user?.otpTimestemp
    console.log(user?.otpTimestemp)
    if (isValid && !isExpired) {
        user.password = newPassword
        await user.save()
        return res.status(200).json({
            success: true,
            mes: 'New password already updated'
        })
    } else if (!isValid) throw new Error(`OTP ${otp} is invalid for ${account}`)
    else if (isExpired) throw new Error(`OTP ${otp} is expired for ${account}`)
})

module.exports = {
    register,
    login,
    update,
    get,
    refreshToken,
    forgotPasswordRequest,
    forgotPasswordVerify
}