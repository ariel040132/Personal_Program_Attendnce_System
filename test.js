// 假設你使用 Express 框架和 Sequelize ORM

const PunchInRecord = require('../models/punchInRecord');
const PunchOutRecord = require('../models/punchOutRecord');

// POST /punchOut 路由處理函式
async function punchOut(req, res) {
  const { userId, punchOutTime, date } = req.body;

  try {
    // 檢查使用者是否存在
    const punchInRecord = await PunchInRecord.findOne({
      where: { userId, date },
    });

    if (!punchInRecord) {
      return res.status(404).json({ error: '上班打卡紀錄不存在或不完整。' });
    }

    // 創建下班打卡紀錄
    const punchOutRecord = await PunchOutRecord.create({
      userId,
      punchOutTime,
      date,
    });

    // 計算上班時長（下班時間減去上班打卡時間）
    const workHours = calculateWorkHours(punchInRecord.punchInTime, punchOutTime);

    // 更新下班打卡紀錄的 workHours 欄位
    await PunchOutRecord.update(
      { workHours },
      { where: { id: punchOutRecord.id } }
    );

    res.status(200).json({ success: true, message: '下班打卡成功。' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '伺服器錯誤，請稍後再試。' });
  }
}

// 計算上班時長
function calculateWorkHours(punchInTime, punchOutTime) {
  // 實現上班時長的計算邏輯，這裡假設為簡單的時間差計算
  const punchInDateTime = new Date(punchInTime);
  const punchOutDateTime = new Date(punchOutTime);
  const workHours = (punchOutDateTime - punchInDateTime) / (1000 * 60 * 60);
  return workHours;
}

module.exports = { punchOut };
