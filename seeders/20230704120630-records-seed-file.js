'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('attendanceRecords',
      Array.from({ length: 20 }, (v, i) => ({
        user_id: users[Math.floor(i / 5)].id,
        punch_in_time: '08:00:00',
        punch_out_time: '17:00:00',
        date: faker.date.between('2023-01-01', '2023-07-05'),
        work_title: faker.lorem.word(),
        work_details: faker.lorem.text(),
        is_attendance: true,
        work_hours: 9,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('attendanceRecords', {})
  }
};