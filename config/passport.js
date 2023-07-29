const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs')
const { User, attendanceRecord } = require('../models')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value; // 取得 Google 帳號的 email
  const googleId = profile.id; // 取得 Google 帳號的 id

  try {
    let user = await User.findOne({
      where: { email: email }
    }) // 根據 Google 帳號的 email 尋找用戶

    if (!user) {
      // 如果該 email 尚未註冊過，則創建新的用戶
      const account = email.split("@")[0]; // 取得 "@" 前面的字串作為 account
      const newUser = {
        name: profile.displayName,
        account: account,
        email: email // 這裡新增了 email
      };

      user = await User.create(newUser);
    }

    done(null, user);
  } catch (err) {
    console.error(err);
  }
}));


// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          return cb(null, user)
        })
      })
  }
))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  return User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      // console.log(user)
      return cb(null, user)
    })
})

// , {
//     include: [
//       { model: Restaurant, as: 'FavoritedRestaurants' },
//       { model: Restaurant, as: 'LikedRestaurants' }
//     ]
//   }

module.exports = passport