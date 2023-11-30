const Sequelize = require('sequelize');

class Meeting extends Sequelize.Model {
  static initiate(sequelize) {
    Meeting.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
          allowNull: false,
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
        startDate: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        endDate: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        availableVotingStartTime: {
          type: Sequelize.TIME,
          allowNull: false,
          defaultValue: '00:00:00',
        },
        availableVotingEndTime: {
          type: Sequelize.TIME,
          allowNull: false,
          defaultValue: '23:59:00',
        },
        maxParticipants: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
        },
        voteExpiresAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        isClosed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        confirmedTime: {
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
    db.Meeting.hasMany(db.Participant);
  }
}

module.exports = Meeting;
