const { User, attendanceRecord } = require('../models')
const bcrypt = require('bcryptjs')
const moment = require('moment');
const user = require('../models/user');

const userController = {
  logIn: (req, res, next) => {
    res.render('login')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/user/home')
  },
  signUpPage: (req, res, next) => {
    res.render('signup')
  },
  postSignUp: (req, res, next) => {
    // 取得註冊表單參數
    const { name, email, account, password, pwdCheck } = req.body
    // 檢查使用者是否已經註冊
    User.findOne({
      where: { email: email }
    }).then(user => {
      // 如果已經註冊：退回原本畫面
      if (user) {
        console.log('User already exists.')
        res.render('signup', {
          name,
          account,
          email,
          password,
          pwdCheck
        })
      } else {
        // 如果還沒註冊：寫入資料庫
        bcrypt.hash(req.body.password, 10)
        .then(hash => User.create({
            name,
            account,
            email,
            password: hash
          }))
            .then(() => res.redirect('/punchin'))
            .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
  },
  logOut: (req, res, next) => {
    req.logout()
    res.redirect('/login')
  },
  getHomePage: (req, res, next) => {
    const userId = req.user.id;
    return attendanceRecord.findAll({
      where: { userId }, 
      include: [{ model: User, attributes: ['account', 'name', 'email'] }],
      attributes: ['workTitle', 'date', 'punchInTime', 'punchOutTime', 'isAttendance', 'workHours'],
    })
      .then((records) => {
        const recordsJSON = records.map(records => records.toJSON())
        res.render('home', { records: recordsJSON });
      })
      .catch((err) => next(err));
  },
  userSettingPage: (req, res, next) => {
    const userId = req.user.id;
    User.findByPk(userId)
    .then((user) => {
      const userJSON = user.toJSON()
      res.render('users/setting', { user: userJSON })
    })
    .catch((error) => next(error));
    //res.render('user-setting')
  },
  editPwdPage: (req, res, next) => {
    res.render('users/edit')
  },
  editPwd: (req, res, next) => {
    const userId = req.user.id;
    const { password, checkpwd } = req.body;
    if (password !== checkpwd) throw new Error("輸入的密碼不相符");
    return bcrypt.hash(req.body.password, 10)
      .then(hash => {
        User.update({ password: hash }, {
          where: { id: userId }
        })
          .then(() => {
            res.redirect('/user/setting');
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  }
}

module.exports = userController