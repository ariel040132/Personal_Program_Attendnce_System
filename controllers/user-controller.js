const { User, attendanceRecord } = require('../models')
const moment = require('moment');

const userController = {
  logIn: (req, res, next) => {
    res.render('login')
  }  
}

module.exports = userController