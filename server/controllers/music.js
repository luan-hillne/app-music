const Music = require('../models/music');
const Artist = require('../models/artist')
const Category = require('../models/category')
const asyncHandler = require('express-async-handler')
const { Binary } = require('mongodb');
const { isVip } = require('../middlewares/authorization');

const upload = asyncHandler(async (req, res) => {
    const { name, category, artistname, copyright } = req.body
    let artistId = null
    const artist = await Artist.findOne({ name: artistname })
    artistId = artist?._id
    if (!artist) {
        const newArtist = await Artist.create({ name: artistname })
        artistId = newArtist?._id
    }
    const bufferAvatar = req.files['avatar'][0]?.buffer
    const bufferAudio = req.files['audio'][0]?.buffer
    const binaryAvatar = new Binary(bufferAvatar)
    const binaryAudio = new Binary(bufferAudio)
    const response = await Music.create({
        name: name,
        data: binaryAudio,
        avatar: binaryAvatar,
        category: category,
        artist: artistId,
        copyright: !!copyright
    })
    return res.status(200).json({
        success: response ? true : false
    })
})

const getMusic = asyncHandler(async (req, res) => {
    const response = await Music.findById({
        _id: req.query.id
    })
        .populate('artist', 'name dateOfBirth dateOfDeath bio')
    if (!!response.copyright === true) {
        const { vip } = req.user
        if (+vip === 0) throw new Error('Require vip Role')
    }

    return res.status(200).json({
        success: response ? true : false,
        mes: response
    })
})
const getList = asyncHandler(async (req, res) => {
    const { cate, limit, top } = req.query
    let sort = {
        [top]: -1
    }

    const cateId = await Category.findOne({ name: cate })
    if (!cateId) throw new Error('Can not find Category')

    const response = await Music.find({
        category: cateId._id,
    })
        .limit(limit)
        .sort(sort)
        .select('_id name countListen copyright artist')
        .populate('artist', 'name')
    const img = await Music.findById(response[0]._id).select('avatar')
    return res.status(200).json({
        success: response ? true : false,
        music: response,
        image: img,
    })
})

const getCate = asyncHandler(async (req, res) => {
    const { cate } = req.query
    const batchSize = 50
    const cateId = await Category.findOne({ name: cate })
    if (!cateId) throw new Error('Can not find Category')

    const response = Music.find({
        category: cateId._id,
    })
        .select('_id name countListen copyright artist avatar')
        .populate('artist', 'name')

    const musics = []
    let i = 0
    for await (const _music of response) {
        musics.push(_music);
        i++;
        if (i === batchSize) {
            break;
        }
    }

    return res.status(200).json({
        success: response ? true : false,
        music: musics,
    })
})

const destroy = asyncHandler(async (req, res) => {
    const response = await Music.deleteOne({ _id: req.query.id })
    return res.status(200).json({
        success: response ? true : false
    })
})

module.exports = {
    upload,
    getMusic,
    destroy,
    getList,
    getCate
}