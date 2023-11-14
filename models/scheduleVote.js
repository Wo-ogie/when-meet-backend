const Sequelize = require('sequelize');

class ScheduleVote extends Sequelize.Model {
  static initiate(sequelize) {
    ScheduleVote.init(
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
        modelName: 'ScheduleVote',
        tableName: 'schedule_votes',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      },
    );
  }

  static associate(db) {
    db.ScheduleVote.belongsTo(db.User);
  }
}

module.exports = ScheduleVote;
