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
      const recordsJSON = records.map(record => {
        const user = record.User.toJSON();
        return {
        id: record.id,
        workTitle: record.workTitle,
        punchInTime: moment(record.punchInTime).format('YYYY-MM-DD HH:mm:ss'),
        punchOutTime: moment(record.punchOutTime).format('YYYY-MM-DD HH:mm:ss'),
        isAttendance: record.isAttendance,
        workHours: record.workHours,
        User: user
        }});
      res.render('admin/allrecords', { records: recordsJSON });
    })
    .catch((err) => next(err));
  },
  patchRecords: (req, res, next) => {
    return attendanceRecord.findByPk(req.params.id).then(record => {
      if (!record) throw new Error('該筆紀錄不存在。')
      return record.update({ isAttendance: !record.isAttendance })
    }).then(() => {
      req.flash('success_msg', '成功清除缺勤狀態')
      res.redirect('/admin/allrecords')
    })
      .catch(err => next(err))
  }
}

module.exports = adminController