'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('attendanceRecords', 'work_hours', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('attendanceRecords', 'work_hours');
  }
};
