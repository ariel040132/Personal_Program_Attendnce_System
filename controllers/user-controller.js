const { User, attendanceRecord } = require('../models')
const bcrypt = require('bcryptjs')
const moment = require('moment');

const userController = {
  logIn: (req, res, next) => {
    res.render('login')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/punchin')
  },
  getSignUp: (req, res, next) => {
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
  }
}

module.exports = userController