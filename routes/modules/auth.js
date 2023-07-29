const express = require("express");
const router = express.Router();
const passport = require('../../config/passport')

router.post('/google', passport.authenticate('google', {
  scope: [ 'email', 'profile' ],
}));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);


module.exports = router