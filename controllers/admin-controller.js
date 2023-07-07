const { User, attendanceRecord } = require('../models')
const moment = require('moment');

const adminController = {
  allRecords: (req, res, next) => {
    return attendanceRecord.findAll({
      include: [{ model: User, attributes: ['account', 'name', 'email'] }],
      attributes: ['id', 'workTitle', 'punchInTime', 'punchOutTime', 'isAttendance', 'workHours'],
      order: [['punchInTime', 'DESC']],
    })
      .then((records) => {
        const recordsJSON = records.map(record => record.toJSON());
        res.render('admin/allrecords', { records: recordsJSON });
      })
      .catch((err) => next(err));
  },
  patchRecords: (req, res, next) => {
    return attendanceRecord.findByPk(req.params.id).then(record => {
      if (!record) throw new Error('該筆紀錄不存在。')
      return record.update({ isAttendance: !record.isAttendance })
    }).then(() => {
      req.flash('success_msg', '出席紀錄變更成功')
      res.redirect('/admin/allrecords')
    })
      .catch(err => next(err))
  }
}

module.exports = adminController