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
        currentParticipants: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
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
