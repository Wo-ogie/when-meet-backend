const Sequelize = require('sequelize');

class Schedule extends Sequelize.Model {
  static initiate(sequelize) {
    Schedule.init(
      {
        availableDate: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        availableTimes: {
          type: Sequelize.JSON,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Schedule',
        tableName: 'schedules',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      },
    );
  }

  static associate(db) {
    db.Schedule.belongsTo(db.User);
  }
}

module.exports = Schedule;
