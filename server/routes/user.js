const router = require('express').Router()
const ctrls = require('../controllers')
const { verifyToken } = require('../middlewares/authorization')
const upload = require('../configs/multer')

router.post('/signup', ctrls.user.register)
router.post('/signin', ctrls.user.login)
router.post('/refresh_token', ctrls.user.refreshToken)
router.post('/get_otp', ctrls.user.forgotPasswordRequest)
router.post('/verify_otp', ctrls.user.forgotPasswordVerify)
router.use(verifyToken)
router.put('/update', upload.single('avatar'), ctrls.user.update)
router.get('/', ctrls.user.get)
router.get('/upgrate_plant', ctrls.extend.upgratePlant)



module.exports = router 