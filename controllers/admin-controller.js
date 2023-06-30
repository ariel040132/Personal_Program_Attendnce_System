const { User, attendanceRecord } = require('../models')
const moment = require('moment');

const adminController = {
  allRecords: (req, res, next) => {
  return attendanceRecord.findAll({
    include: [{ model: User, attributes: ['account', 'name'] }],
    attributes: ['workTitle', 'punchInTime', 'punchOutTime', 'isAttendance', 'workHours'],
  })
    .then((records) => {
      res.status(200).json(records);
    })
    .catch((err) => next(err));
  }
}

module.exports = adminController