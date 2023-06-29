'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('attendanceRecords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      punch_in_time: {
        type: Sequelize.TIME
      },
      punch_out_time: {
        type: Sequelize.TIME
      },
      date: {
        type: Sequelize.DATE
      },
      work_title: {
        type: Sequelize.STRING
      },
      work_details: {
        type: Sequelize.TEXT
      },
      is_attendance: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('attendanceRecords');
  }
};