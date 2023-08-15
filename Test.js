const { body, validationResult } = require('express-validator');

router.post('/register', [
  // 使用 express-validator 進行表單驗證
  body('name').notEmpty().withMessage('名稱不能為空'),
  body('email').isEmail().withMessage('請輸入有效的電子郵件地址'),
  body('account').notEmpty().withMessage('帳號不能為空'),
  body('password').notEmpty().withMessage('密碼不能為空'),
  body('pwdCheck').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('密碼與確認密碼不相符');
    }
    return true;
  }),
], (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    // 有錯誤時重新渲染註冊頁面，並顯示錯誤訊息
    return res.render('signup', {
      errors: errors.array(),
      name: req.body.name,
      account: req.body.account,
      email: req.body.email,
      password: req.body.password,
      pwdCheck: req.body.pwdCheck,
    });
  }

  // 表單驗證通過，執行註冊邏輯
  // ...
});
