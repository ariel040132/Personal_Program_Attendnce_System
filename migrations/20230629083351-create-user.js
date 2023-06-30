'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        defaultValue: false,
        type: Sequelize.STRING
      },
      email: {
        defaultValue: false,
        type: Sequelize.STRING
      },
      account: {
        defaultValue: false,
        type: Sequelize.STRING
      },
      password: {
        defaultValue: false,
        type: Sequelize.STRING
      },
      role: {
        defaultValue: false,
        type: Sequelize.STRING,
        defaultValue: 'user'
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
    return queryInterface.dropTable('users');
  }
};