const { attendanceRecord } = require('../models');
const moment = require('moment');

const punchOut = async (req, res, next) => {
  const { userId } = req.body;
  const today = moment().format('YYYY-MM-DD');

  try {
    // 查詢當日的上班卡紀錄
    const record = await attendanceRecord.findOne({
      where: {
        userId,
        date: today,
      },
    });

    if (!record) {
      return res.status(404).json({ message: '當日未找到上班卡紀錄' });
    }

    // 檢查是否已經打過下班卡
    if (record.punch_out_time) {
      return res.status(400).json({ message: '已經打過下班卡' });
    }

    // 設定下班時間
    record.punch_out_time = moment().format('HH:mm');

    // 計算工作時數
    const punchIn = moment(record.punch_in_time, 'HH:mm');
    const punchOut = moment(record.punch_out_time, 'HH:mm');
    const workHours = punchOut.diff(punchIn, 'hours');

    record.work_hours = workHours;

    // 設定出勤狀態
    record.is_attendance = workHours >= 8 ? 1 : 0;

    // 儲存更新後的出勤紀錄
    await record.save();

    return res.status(200).json(record);
  } catch (err) {
    return next(err);
  }
};

module.exports = punchOut;


// POST /punchOut 路由處理
router.post('/punchOut', async (req, res) => {
  try {
    const { userId, punch_out_time, date, work_hours } = req.body;

    // 查找對應的上班打卡紀錄
    const attendanceRecord = await AttendanceRecord.findOneAndUpdate(
      { userId, date, punch_out_time: null }, // 查找條件：使用者ID、日期、尚未打下班卡的紀錄
      { punch_out_time: moment(punch_out_time).format('HH:mm'), work_hours }, // 更新項目：下班打卡時間、工時
      { new: true } // 返回更新後的紀錄
    );

    if (!attendanceRecord) {
      return res.status(404).json({ message: '找不到對應的上班打卡紀錄' });
    }

    res.json(attendanceRecord); // 回傳更新後的出勤紀錄
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '更新出勤紀錄失敗' });
  }
});

module.exports = router;
