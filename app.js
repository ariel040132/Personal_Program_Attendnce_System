if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require("express");
const exphbs = require("express-handlebars");
const port = process.env.PORT || 3000;
const routes = require("./routes");
const methodOverride = require("method-override");
const session = require("express-session");
const SESSION_SECRET = 'secret'
const passport = require('./config/passport')
const flash = require("connect-flash");
const { getUser } = require('./helpers/auth-helpers')

//*======app.setting======

const app = express();

app.engine(".hbs", exphbs({ defaultLayout: "main", extname: '.hbs' }));
app.set("view engine", ".hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = getUser(req);
  res.locals.success_msg = req.flash("success_msg"); // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash("warning_msg"); // 設定 warning_msg 訊息
  next();
});
//*====引入路由應在底部====
app.use(routes);

//*底部
app.listen(port, () => {
  console.info(`Express app listening on port ${port}.`);
});
