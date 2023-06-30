const { User, attendanceRecord } = require('../models')
const moment = require('moment');

const recordController = {
  getHomePage: (req, res, next) => {
    res.render('clock-in')
  },
  punchIn: (req, res, next) => {
    const { userId, punchInTime, date, workTitle, workDetails } = req.body;
    if (!userId || !punchInTime || !date || !workTitle ) {
      return res.status(400).json({ message: '請填寫所有必填欄位' });
    }
    return attendanceRecord.create({
      userId,
      punchInTime,
      date,
      workTitle,
      workDetails,
    })
    .then((record) => {
    return res.status(201).json(record);
    })
    .catch(err => next(err));
  },
  getHome2Page: (req, res, next) => {
    res.render('clock-out')
  },
  punchOut: (req, res, next) => {
    const { userId } = req.body;
    const today = moment().format('YYYY-MM-DD');
    attendanceRecord.findOne({
        where: {
          userId,
          date: today,
        },
      }).then((record) => {
        // 查詢當日的上班卡紀錄
        if (!record) {
        return res.status(404).json({ message: '當日未找到上班卡紀錄' });
        }
        // 檢查是否已經打過下班卡
        if (record.punch_out_time) {
          return res.status(400).json({ message: '已經打過下班卡' });
        }
        // 設定下班時間
         record.punchOutTime = moment().format('HH:mm:ss');

        // 計算工作時數
        const punchIn = moment(record.punchInTime, 'HH:mm:ss');
        const punchOut = moment(record.punchOutTime, 'HH:mm:ss');
        const workHours = punchOut.diff(punchIn, 'hours');
        record.workHours = workHours
        // 設定出勤狀態
        record.isAttendance = workHours >= 8 ? 1 : 0;
        // 儲存更新後的出勤紀錄
        record.save().then(()=>{
          return res.status(200).json(record);
        }).catch(err => next(err))
      }).catch(err => next(err))
  }
}

module.exports = recordController