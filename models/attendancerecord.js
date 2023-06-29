'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class attendanceRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      attendanceRecord.belongsTo(models.user, { foreignKey: 'userId' });
    }
  };
  attendanceRecord.init({
    userId: DataTypes.INTEGER,
    punchInTime: DataTypes.TIME,
    punchOutTime: DataTypes.TIME,
    date: DataTypes.DATE,
    workTitle: DataTypes.STRING,
    workDetails: DataTypes.TEXT,
    isAttendance: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'attendanceRecord',
    tableName: 'attendanceRecords',
    underscored: true
  })
  return attendanceRecord
}