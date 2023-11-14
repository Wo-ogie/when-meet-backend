const Sequelize = require('sequelize');

class Meeting extends Sequelize.Model {
  static initiate(sequelize) {
    Meeting.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        adminPassword: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        purpose: {
          type: Sequelize.ENUM('STUDY', 'ETC'),
          allowNull: false,
        },
        numOfParticipants: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
        },
        voteExpiresAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Meeting',
        tableName: 'meetings',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      },
    );
  }

  static associate(db) {
    db.Meeting.hasMany(db.User);
  }
}

module.exports = Meeting;
