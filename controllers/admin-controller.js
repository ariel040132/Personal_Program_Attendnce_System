const { User, attendanceRecord } = require('../models')
const moment = require('moment');

const adminController = {
  allRecords: (req, res, next) => {
    return attendanceRecord.findAll({
      include: [{ model: User, attributes: ['account', 'name', 'email'] }],
      attributes: ['workTitle','date', 'punchInTime', 'punchOutTime', 'isAttendance', 'workHours'],
    })
      .then((records) => {
        const recordsJSON = records.map(record => record.toJSON());
        console.log(recordsJSON);
        res.render('admin/allrecords', { records: recordsJSON });
      })
      .catch((err) => next(err));
  }
}

module.exports = adminController