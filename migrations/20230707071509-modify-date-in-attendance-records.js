'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('attendanceRecords', 'date'),
      queryInterface.changeColumn('attendanceRecords', 'punch_in_time', {
        type: Sequelize.DATE,
      }),
      queryInterface.changeColumn('attendanceRecords', 'punch_out_time', {
        type: Sequelize.DATE,
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('attendanceRecords', 'date', {
        type: Sequelize.DATEONLY,
      }),
      queryInterface.changeColumn('attendanceRecords', 'punch_in_time', {
        type: Sequelize.TIME,
      }),
      queryInterface.changeColumn('attendanceRecords', 'punch_out_time', {
        type: Sequelize.TIME,
      })
    ]);
  }
};

