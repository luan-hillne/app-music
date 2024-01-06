const Category = require('../models/category')
const asyncHandler = require('express-async-handler')

const get = asyncHandler(async (req, res) => {
    const categories = await Category.find()
    return res.status(200).json({
        success: categories ? true : false,
        data: categories
    })
})

module.exports = {
    get,
}