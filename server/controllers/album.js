const Album = require('../models/album')
const asyncHandler = require('express-async-handler')
const { Binary } = require('mongodb');

const get = asyncHandler(async (req, res) => {

    return res.status(200).json({
        success: response ? true : false,
        mes: response
    })
})

const create = asyncHandler(async (req, res) => {
    const { name, author, description, musics } = req.body
    if (!name || !author || !description || !musics) throw new Error('missing input')
    const bufferAvatar = req.file?.buffer || null
    const binaryAvatar = new Binary(bufferAvatar)
    const newAlbum = await Album.create({
        name,
        author,
        musics,
        description,
        avatar: binaryAvatar
    })
    return res.status(200).json({
        success: newAlbum ? true : false
    })
})

const update = asyncHandler(async (req, res) => {
    const { name, dateOfBirth, dateOfDeath, bio, id } = req.body
    const artist = await Album.findById(id)
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

const destroy = asyncHandler(async (req, res) => {
    const response = await Music.deleteOne({ _id: req.query.id })
    return res.status(200).json({
        success: response ? true : false
    })
})

module.exports = {
    get,
    create,
    update,
    destroy
}