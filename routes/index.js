const express = require("express");
const router = express.Router();
const recordController = require('../controllers/record-controller')
const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('../routes/modules/admin')
const authGoogle = require('./modules/auth')

router.use('/admin', admin)
router.use('/auth', authGoogle)

//! 使用者登入、註冊、登出
router.get('/login', userController.logIn)
  //* google 登入
// router.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login'}), userController.signIn)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.signIn)
router.post('/register', userController.postSignUp)
router.get('/register', userController.signUpPage)
router.get('/logout', userController.logOut)

//! 打卡功能
router.post('/punchin', authenticated, recordController.punchIn)
router.put('/punchout', authenticated, recordController.punchOut)
router.get('/punchout', authenticated, recordController.ClockOutPage)
router.get('/punchin', authenticated, recordController.ClockInPage)

//! 使用者設定
router.put('/user/editPwd', authenticated, userController.editPwd)
router.get('/user/editPwd', authenticated, userController.editPwdPage)
router.get('/user/setting', authenticated, userController.userSettingPage)

//! 使用者首頁
router.get('/user/home', authenticated, userController.getHomePage)

router.get('/', (req, res, next) => res.redirect('/user/home'))
router.use('/', generalErrorHandler)

module.exports = router;