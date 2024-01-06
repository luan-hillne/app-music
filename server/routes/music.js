const router = require('express').Router()
const ctrls = require('../controllers')
const upload = require('../configs/multer')
const { verifyToken, isAdmin } = require('../middlewares/authorization')

router.use(verifyToken)
router.get('/list', ctrls.music.getList)
router.get('/cate', ctrls.music.getCate)
router.get('/', ctrls.music.getMusic)
router.use(isAdmin)
router.post('/upload', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), ctrls.music.upload)
router.delete('/delete', ctrls.music.destroy)


module.exports = router 