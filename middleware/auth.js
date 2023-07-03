const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    return next()
  }
  req.flash('warning_msg', '請先登入才能使用！')
  res.redirect('/login')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    if (getUser(req).role === 'admin') return next()
    res.redirect('/')
  } else {
    req.flash('warning_msg', '請先登入才能使用！')
    res.redirect('/login')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}