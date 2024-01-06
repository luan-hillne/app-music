const router = require('express').Router()
const ctrls = require('../controllers')
const upload = require('../configs/multer')
const { verifyToken, isAdmin } = require('../middlewares/authorization')

router.use(verifyToken)
router.get('/', ctrls.artist.getArtist)
router.get('/id', ctrls.artist.getOne)
router.use(isAdmin)
router.post('/create', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), ctrls.artist.create)
router.post('/update', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), ctrls.artist.update)

module.exports = router 