const Sequelize = require('sequelize');
const { sequelize } = require('../models/index');
const {
  createMostConfirmedTimeNotFoundError,
} = require('../errors/meetingErrors');

exports.getMostConfirmedTime = async (purpose) => {
  const query = `
      SELECT EXTRACT(HOUR FROM m.confirmed_time) AS confirmed_time_hour,
             COUNT(1)                            AS confirmed_time_count
      FROM meetings m
      WHERE m.is_closed
        AND m.purpose = :purpose
        AND m.confirmed_time IS NOT NULL
      GROUP BY confirmed_time_hour
      ORDER BY confirmed_time_count DESC;
  `;
  const params = {
    replacements: { purpose },
    type: Sequelize.QueryTypes.SELECT,
    plain: true,
  };
  const result = await sequelize.query(query, params);
  if (!result) {
    throw createMostConfirmedTimeNotFoundError();
  }
  return {
    hour: result.confirmed_time_hour,
    count: result.confirmed_time_count,
  };
};
