const { User, attendanceRecord } = require('../models')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');
const moment = require('moment');

const userController = {
  logIn: (req, res, next) => {
    res.render('login')
  },
  signIn: (req, res) => {
    // const { clientId, credential, select_by } = req.body;
    // console.log('ClientId:', clientId);
    // console.log('Credential:', credential);
    // console.log('Select By:', select_by);

    req.flash('success_msg', '成功登入！')
    res.redirect('/user/home')
  },
  signUpPage: (req, res, next) => {
    res.render('signup')
  },
postSignUp: [
  // 使用 express-validator 進行表單驗證
  body('name').notEmpty().withMessage('名稱不能為空'),
  body('email').isEmail().normalizeEmail().withMessage('請輸入有效的電子郵件地址'),
  body('account').notEmpty().withMessage('帳號不能為空'),
  body('password').notEmpty().withMessage('密碼不能為空'),
  body('pwdCheck').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('密碼與確認密碼不相符');
    }
    return true;
  }),

  (req, res, next) => {
    // 取得註冊表單參數
    const errorsMessages = validationResult(req);

    if (!errorsMessages.isEmpty()) {
      const errors = errorsMessages.array().map(error => ({ message: `${error.msg}`} ));
      // 有錯誤時重新渲染註冊頁面，並顯示錯誤訊息
      return res.render('signup', {
        errors,
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: req.body.password,
        pwdCheck: req.body.pwdCheck,
      });
    }
    
    // 檢查使用者是否已經註冊
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          const errors = [{ message: '這個 Email 已經註冊過了。' }];
          return res.render('signup', {
            errors,
            name: req.body.name,
            account: req.body.account,
            email: req.body.email,
            password: req.body.password,
            pwdCheck: req.body.pwdCheck,
          });
        } else {
          return bcrypt.hash(req.body.password, 10)
            .then(hash => User.create({
              name: req.body.name,
              account: req.body.account,
              email: req.body.email,
              password: hash
            }))
            .then(() => {
              req.flash('success_msg', '成功註冊帳號！');
              res.redirect('/punchin');
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  }
]
,
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
    attributes: ['id', 'workTitle', 'workDetails', 'punchInTime', 'punchOutTime', 'isAttendance', 'workHours'],
    order: [['punchInTime', 'DESC']],
  })
    .then((records) => {
      const recordsJSON = records.map(record => {
        const user = record.User.toJSON();
        return {
        id: record.id,
        workTitle: record.workTitle,
        workDetail: record.workDetails,
        punchInTime: moment(record.punchInTime).format('YYYY-MM-DD HH:mm:ss'),
        punchOutTime: moment(record.punchOutTime).format('YYYY-MM-DD HH:mm:ss'),
        isAttendance: record.isAttendance,
        workHours: record.workHours,
        User: user
        }});
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
    if (!password || !checkpwd) throw new Error("請輸入必填欄位")
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