const { User, attendanceRecord } = require('../models')
const bcrypt = require('bcryptjs')
const moment = require('moment');

const userController = {
  logIn: (req, res, next) => {
    res.render('login')
  },
  signIn: (req, res) => {
    req.flash('success_msg', '成功登入！')
    res.redirect('/user/home')
  },
  signUpPage: (req, res, next) => {
    res.render('signup')
  },
  postSignUp: (req, res, next) => {
    // 取得註冊表單參數
    const { name, email, account, password, pwdCheck } = req.body
    const errors = []

    if (!name || !account || !email || !password || !pwdCheck) {
      errors.push({ message: '所有欄位都是必填。' })
    }

    if (password !== pwdCheck) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }

    if (errors.length) {
      return res.render('signup', {
        errors,
        name,
        account,
        email,
        password,
        pwdCheck
      })
    }
    // 檢查使用者是否已經註冊
    User.findOne({ where: { email: email } })
      .then(user => {
        if (user) {
          errors.push({ message: '這個 Email 已經註冊過了。' })
          res.render('signup', {
            errors,
            name,
            email,
            account,
            password,
            pwdCheck
          })
        } else {
          return bcrypt.hash(req.body.password, 10)
          .then(hash => 
            User.create({ name, account, email, password: hash })
          .then(() => {
            req.flash('success_msg', '成功註冊帳號！')
            res.redirect('/punchin')
      }))
      .catch(err => next(err))
    }
  }) 
},
  logOut: (req, res, next) => {
    req.logout()
    req.flash('success_msg', '你已經成功登出。')
    res.redirect('/login')
  },
  getHomePage: (req, res, next) => {
    const userId = req.user.id;
    return attendanceRecord.findAll({
      where: { userId }, 
      include: [{ model: User, attributes: ['account', 'name', 'email'] }],
      attributes: ['workTitle', 'punchInTime', 'punchOutTime', 'isAttendance', 'workHours'],
      order: [['punchInTime', 'DESC']],
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