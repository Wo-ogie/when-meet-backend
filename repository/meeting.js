const Sequelize = require('sequelize');
const { sequelize } = require('../models/index');
const {
  createMostConfirmedTimeNotFoundError,
} = require('../errors/meetingErrors');

exports.getTopThreeConfirmedTimes = async (purpose) => {
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
  };
  const results = await sequelize.query(query, params);
  if (!results || results.length === 0) {
    throw createMostConfirmedTimeNotFoundError();
  }
  return results.slice(0, 3).map((result) => ({
    hour: result.confirmed_time_hour,
    count: result.confirmed_time_count,
  }));
};
