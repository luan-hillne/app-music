const router = require('express').Router()
const ctrls = require('../controllers')
const upload = require('../configs/multer')
const { verifyToken, isAdmin } = require('../middlewares/authorization')

router.use(verifyToken)
// router.get('/', ctrls.album.getArtist)
router.use(isAdmin)
router.post('/create', upload.single('avatar'), ctrls.album.create)
router.post('/update', upload.single('avatar'), ctrls.album.update)
router.delete('/update', ctrls.album.destroy)

module.exports = router 