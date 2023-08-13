const { User, attendanceRecord } = require('../models')
const moment = require('moment-timezone');
const axios = require('axios');
const Sequelize = require('sequelize')

const recordController = {
  ClockInPage: (req, res, next) => {
    res.render('clock-in')
  },
  ClockOutPage: (req, res, next) => {
    res.render('clock-out')
  },
  punchIn: (req, res, next) => {
  const userId = req.user.id;
  //打卡當下時間
  const punchInTime = moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
  //提取日期部分，換日時間為凌晨五點
  const today = moment(punchInTime, 'YYYY-MM-DD HH:mm:ss').subtract(5, 'hours').format('YYYY-MM-DD'); 
  //獲得前端表單的內容  
  const { workTitle, workDetails } = req.body;
  //判斷是否為假日
  async function checkHoliday(today) {
  try {
    const response = await axios.get(`https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/2023.json`);
    const formattedDate = moment(today).format('YYYYMMDD');
    const holidays = response.data;
    const isHoliday = holidays.some((holiday) => holiday.date === formattedDate && holiday.isHoliday);
    return isHoliday;
  } catch (error) {
    console.error('Error checking holiday:', error);
    throw error;
  }
}

  if (!userId || !punchInTime || !workTitle) {
    throw new Error('請填寫工作欄位。');
  }

  checkHoliday(today)
    .then(isHoliday => {
      if (isHoliday) {
        throw new Error('今天是假日，無法打卡。');
      }

      const startDate = moment(today).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      const endDate = moment(today).endOf('day').format('YYYY-MM-DD HH:mm:ss');

      return attendanceRecord.findOne({
        where: {
          userId,
          punchInTime: {
            [Sequelize.Op.between]: [startDate, endDate],
          }
        }
      });

    })
    .then(record => {
      if (record) {
        throw new Error('今天已經打過上班卡。');
      }

      return attendanceRecord.create({
        userId,
        punchInTime,
        workTitle,
        workDetails,
      });
    })
    .then(() => {
      req.flash('success_msg', '上班打卡成功')
      res.redirect('/');
    })
    .catch(err => {
      next(err);
    });
},
  punchOut: (req, res, next) => {
    const userId = req.user.id
    //獲取當下時間 
    const punchOutTime = moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
    //提取日期部分進行換日判定
    const today = moment(punchOutTime, 'YYYY-MM-DD HH:mm:ss').subtract(5, 'hours').format('YYYY-MM-DD');
    //查找資料
    return attendanceRecord.findOne({
        where: {
          userId,
          punchInTime: {
            [Sequelize.Op.between]: [
              moment(today).startOf('day').format('YYYY-MM-DD HH:mm:ss'), 
              moment(today).endOf('day').format('YYYY-MM-DD HH:mm:ss') 
            ]
          }
        },
      })
      .then((record) => {
        // 查詢當日的上班卡紀錄
        if (!record) throw new Error('今天尚未打過上班卡')

        // 設定下班時間
        record.punchOutTime = punchOutTime
        // 計算工作時數
        const punchIn = moment(record.punchInTime, 'YYYY:MM:DD HH:mm:ss');
        const punchOut = moment(record.punchOutTime, 'YYYY:MM:DD HH:mm:ss');
        const workHours = Math.floor((punchOut - punchIn) / (1000 * 60 * 60));
        record.workHours = workHours
        // 設定出勤狀態
        record.isAttendance = workHours >= 8 ? 1 : 0;
        // 儲存更新後的出勤紀錄
        return record.save()
        .then(() => {
          req.flash('success_msg', '下班打卡成功')
          res.redirect('/');
        })
        .catch(err => next(err))
      })
      .catch(err => next(err))
  },
  showRecord: (req, res, next) => {
    const id = req.params.id
    return attendanceRecord.findByPk(id, {
        include: [{ model: User, attributes: ['account', 'name', 'email'] }],
        attributes: ['id', 'workTitle', 'workDetails', 'punchInTime', 'punchOutTime', 'isAttendance', 'workHours']
    })
    .then(record => {
      record = record.toJSON()
      record.punchInTime = moment(record.punchInTime).format('YYYY/MM/DD hh:mm:ss');
      record.punchOutTime = moment(record.punchOutTime).format('YYYY/MM/DD hh:mm:ss');
      console.log(record);
      res.render('show', { record });
    });
}

}

module.exports = recordController