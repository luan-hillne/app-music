const Artist = require('../models/artist')
const Album = require('../models/album')
const Music = require('../models/music')
const asyncHandler = require('express-async-handler')
const { Binary } = require('mongodb');

const getArtist = asyncHandler(async (req, res) => {
    const batchSize = 6
    const artist = Artist.find().cursor({ batchSize })
    const artists = []
    let i = 0

    for await (const _artist of artist) {
        artists.push(_artist);
        i++;
        if (i === batchSize) {
            break;
        }
    }
    return res.status(200).json({
        success: artist ? true : false,
        mess: artists,
    })
})

const getOne = asyncHandler(async (req, res) => {
    if (!req.query.id) throw new Error('id is required')
    const artist = await Artist.findById(req.query.id)
    if (!artist) throw new Error('Can not find artist')
    const album = await Album.find({ author: req.query.id })
        .populate('musics', 'name')

    const music = Music.find({
        artist: req.query.id,
    })
        .select('_id name countListen copyright avatar category')
        .populate('category', 'name')
        .cursor({ batchSize: 25 })

    const musics = []
    let i = 0
    for await (const _music of music) {
        musics.push(_music);
        i++;
        if (i === 25) {
            break;
        }
    }
    return res.status(200).json({
        success: artist ? true : false,
        album: album,
        artist: artist,
        musics: musics
    })
})

const create = asyncHandler(async (req, res) => {
    const { name, dateOfBirth, dateOfDeath, bio } = req.body
    if (!name || !dateOfBirth || !bio) throw new Error('missing input')
    const artist = await Artist.findOne({ name: name })
    if (artist) throw new Error('Artist has expired')
    else {
        const bufferAvatar = req.files['avatar'][0]?.buffer
        const bufferThumbnail = req.files['thumbnail'][0]?.buffer
        const binaryAvatar = new Binary(bufferAvatar) || null
        const binaryThumbnail = new Binary(bufferThumbnail) || null
        const newArtist = await Artist.create({
            name,
            dateOfBirth,
            dateOfDeath,
            bio,
            avatar: binaryAvatar,
            thumbnail: binaryThumbnail
        })
        return res.status(200).json({
            success: newArtist ? true : false
        })
    }
})

const update = asyncHandler(async (req, res) => {
    const { name, dateOfBirth, dateOfDeath, bio, id } = req.body
    const artist = await Artist.findById(id)
    if (!artist) throw new Error('can not find artist')
    const bufferAvatar = req.files['avatar'][0]?.buffer || null
    const bufferThumbnail = req.files['thumbnail'][0]?.buffer || null
    const binaryAvatar = new Binary(bufferAvatar)
    const binaryThumbnail = new Binary(bufferThumbnail)

    artist.name = name || artist.name
    artist.dateOfBirth = dateOfBirth || artist.dateOfBirth
    artist.dateOfDeath = dateOfDeath || artist.dateOfDeath
    artist.bio = bio || artist.bio
    if (bufferAvatar) artist.avatar = binaryAvatar
    if (bufferThumbnail) artist.thumbnail = binaryThumbnail

    await artist.save()
    return res.status(200).json({
        success: artist ? true : false,
        mess: 'Update successfully'
    })
})

module.exports = {
    getArtist,
    create,
    update,
    getOne
}