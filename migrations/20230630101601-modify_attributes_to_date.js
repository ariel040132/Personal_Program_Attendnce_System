'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('attendanceRecords', 'date', {
      type: Sequelize.DATEONLY
  });

  },

  down: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('attendanceRecords', 'date', 'date');
  }
};
