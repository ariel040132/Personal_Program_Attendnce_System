const express = require("express");
const router = express.Router();
const recordController = require('../controllers/record-controller')
const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const admin = require('../routes/modules/admin')

router.use('/admin', admin)

//! 使用者登入、註冊、登出
router.get('/login', userController.logIn)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.signIn)
router.post('/register', userController.postSignUp)
router.get('/register', userController.getSignUp)
router.get('/logout', userController.logOut)

//! 打卡功能
router.post('/punchin', authenticated, recordController.punchIn)
router.put('/punchout', authenticated, recordController.punchOut)
router.get('/punchout', authenticated, recordController.getClockOutPage)
router.get('/punchin', authenticated, recordController.getClockInPage)


//! 使用者首頁
router.get('/', userController.getHomePage)

module.exports = router;