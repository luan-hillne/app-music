const Music = require('../models/music')
const Artist = require('../models/artist')
const Album = require('../models/album')
const User = require('../models/user')
const Analytic = require('../models/analytic')
const { gennerateAccessToken } = require('../middlewares/jwt')
const asyncHandler = require('express-async-handler')

const search = asyncHandler(async (req, res) => {
    var { content } = req.query
    var response = null
    var path = ''
    if (content.includes('/artist')) {
        content = content.split('/artist')[1]
        const regex = new RegExp(content, 'i')
        response = await Artist.find({ name: regex }).limit(7).select('name')
        path = '/artist/'
    }
    else if (content.includes('/album')) {
        content = content.split('/album')[1]
        const regex = new RegExp(content, 'i')
        response = await Album.find({ name: regex }).limit(7).select('name author')
        path = '/artist/'
    }
    else {
        const regex = new RegExp(content, 'i')
        response = await Music.find({ name: regex }).limit(7).select('name')
        path = '/music/'
    }
    return res.status(200).json({
        success: response ? true : false,
        result: response,
        path
    })
})

const upgratePlant = asyncHandler(async (req, res) => {
    const user = req.user._id
    if (!user) throw new Error('missing input')
    let accessToken = null
    const response = await User.findById(user)
    if (!response) throw new Error('can not find user')
    if ((+response.vip) === 0) {
        response.vip = 1
        accessToken = gennerateAccessToken(response._id, response.vip)
        const date = new Date
        await Analytic.create({
            user: response._id
        })
        await response.save()
    } else throw new Error('Account already vip role')
    return res.status(200).json({
        success: accessToken ? true : false,
        mes: "succesfully",
        accessToken: 'Bearer ' + accessToken
    })
})

module.exports = {
    search,
    upgratePlant
}