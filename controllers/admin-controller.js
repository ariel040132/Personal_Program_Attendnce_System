const { User, attendanceRecord } = require('../models')
const moment = require('moment');

const adminController = {
  allRecords: (req, res, next) => {
    return attendanceRecord.findAll({
      include: [{ model: User, attributes: ['account', 'name', 'email'] }],
      attributes: ['id', 'workTitle','date', 'punchInTime', 'punchOutTime', 'isAttendance', 'workHours'],
      order: [['date', 'DESC']],
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
      // if (user.email === 'root@example.com') {
      //   req.flash('error_messages', '禁止變更 root 權限')
      //   return res.redirect('back')
      // }
      console.log('record is', record);
      return record.update({ isAttendance: !record.isAttendance })
    }).then(() => {
      req.flash('success_msg', '出席紀錄變更成功')
      res.redirect('/admin/allrecords')
    })
      .catch(err => next(err))
  }
}

module.exports = adminController