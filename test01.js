// 引入相關套件和模型定義
const express = require('express');
const router = express.Router();
const moment = require('moment'); // 引入日期時間處理套件
const AttendanceRecord = require('../models/attendanceRecord');

// POST /punchIn 路由處理
router.post('/punchIn', async (req, res) => {
  try {
    const { userId, punch_in_time, date, work_title, work_details } = req.body;

    // 創建新的打卡紀錄
    const attendanceRecord = new AttendanceRecord({
      userId,
      punch_in_time: moment(punch_in_time).format('HH:mm'), // 格式化上班打卡時間
      date,
      work_title,
      work_details
    });

    // 儲存打卡紀錄
    await attendanceRecord.save();

    res.json(attendanceRecord); // 回傳創建的打卡紀錄
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '創建打卡紀錄失敗' });
  }
});


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
