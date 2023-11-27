const Sequelize = require('sequelize');

class Participant extends Sequelize.Model {
  static initiate(sequelize) {
    Participant.init(
      {
        name: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Participant',
        tableName: 'participants',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        uniqueKeys: {
          uniqueNameMeetingId: { fields: ['name', 'meeting_id'] },
        },
      },
    );
  }

  static associate(db) {
    db.Participant.belongsTo(db.Meeting);
    db.Participant.hasMany(db.Schedule);
  }
}

module.exports = Participant;
