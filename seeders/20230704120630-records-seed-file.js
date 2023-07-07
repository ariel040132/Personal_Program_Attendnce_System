'use strict';
const faker = require('faker')
const moment = require('moment')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('attendanceRecords',
      Array.from({ length: 20 }, (v, i) => {
        const punchInTime = faker.date.recent(100); // 生成近半年内的随机日期
        const punchOutTime = faker.date.between(punchInTime, moment(punchInTime).endOf('day').toDate());
        let workHours = Math.floor((punchOutTime- punchInTime) / (1000 * 60 * 60))
        let isAttendance = ''
        if ( workHours >= 8 ) { 
          isAttendance = true
        } else {
          isAttendance = false
        }

        return {
          user_id: users[Math.floor(i / 5)].id,
          punch_in_time: moment(punchInTime).format('YYYY-MM-DD HH:mm:ss'),
          punch_out_time: moment(punchOutTime).format('YYYY-MM-DD HH:mm:ss'),
          work_title: faker.lorem.word(),
          work_details: faker.lorem.text(),
          is_attendance: isAttendance,
          work_hours: workHours,
          created_at: new Date(),
          updated_at: new Date()
        }})
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('attendanceRecords', {})
  }
};