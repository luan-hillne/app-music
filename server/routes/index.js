const userRouter = require('./user')
const musicRouter = require('./music')
const artistRouter = require('./artist')
const albumRouter = require('./album')
const { notFound, errorHandler } = require('../middlewares/errorHandler')
const ctrls = require('../controllers')

const initWebRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/music', musicRouter)
    app.use('/api/artist', artistRouter)
    app.use('/api/album', albumRouter)
    app.get('/api/categories', ctrls.category.get)
    app.get('/api/search', ctrls.extend.search)

    app.use(notFound)
    app.use(errorHandler)
}

module.exports = initWebRoutes