const { User, attendanceRecord } = require('../models')
const moment = require('moment');
const axios = require('axios');

const recordController = {
  ClockInPage: (req, res, next) => {
    res.render('clock-in')
  },
  ClockOutPage: (req, res, next) => {
    res.render('clock-out')
  },
  punchIn: (req, res, next) => {
  const userId = req.user.id;
  const punchInTime = moment().format('HH:mm:ss');
  const today = moment().subtract(5, 'hours').startOf('day').format('YYYY-MM-DD');
  const { workTitle, workDetails, date } = req.body;

  function checkHoliday(date) {
    return axios.get(`https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/2023.json`)
      .then(response => {
        const formattedDate = moment(today).format('YYYYMMDD');
        const holidays = response.data;
        const isHoliday = holidays.some((holiday) => holiday.date === formattedDate && holiday.isHoliday);
        return isHoliday;
      })
      .catch(error => {
        console.error('Error checking holiday:', error);
        return false; // 若無法取得行事曆資料，預設為非假日
      });
  }

  if (!userId || !punchInTime || !today || !workTitle) {
    throw new Error('請填寫工作欄位。');
  }

  checkHoliday(date)
    .then(isHoliday => {
      if (isHoliday) {
        throw new Error('今天是假日，無法打卡。');
      }

      return attendanceRecord.findOne({
        where: {
          userId,
          date: today,
        },
      });
    })
    .then(record => {
      if (record) {
        throw new Error('今天已經打過上班卡。');
      }

      return attendanceRecord.create({
        userId,
        punchInTime,
        date: today,
        workTitle,
        workDetails,
      });
    })
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      next(err);
    });
},
  punchOut: (req, res, next) => {
    const userId = req.user.id
    const today = moment().format('YYYY-MM-DD');
    attendanceRecord.findOne({
        where: {
          userId,
          date: today,
        },
      }).then((record) => {
        // 查詢當日的上班卡紀錄
        if (!record) throw new Error('今天尚未打過上班卡')
        // 檢查是否已經打過下班卡
        // if (record.punch_out_time) {
        //   return res.status(400).json({ message: '今天已經打過下班卡' });
        // }
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
          return res.redirect('/');
        }).catch(err => next(err))
      }).catch(err => next(err))
  }
}

module.exports = recordController