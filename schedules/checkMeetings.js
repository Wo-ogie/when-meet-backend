const { scheduleJob } = require('node-schedule');
const { Op } = require('sequelize');
const { Meeting } = require('../models');
const { setMeetingClosedAndSendVoteEndEmail } = require('../services/meeting');

module.exports = async () => {
  console.log(
    'Check meeting... 종료되지 않은 미팅을 찾아 스케줄러에 등록합니다.',
  );
  try {
    const meetings = await Meeting.findAll({
      where: {
        voteExpiresAt: {
          [Op.ne]: null,
        },
        isClosed: false,
      },
    });
    meetings.forEach((meeting) => {
      scheduleJob(meeting.voteExpiresAt, async () => {
        await setMeetingClosedAndSendVoteEndEmail(meeting.id);
      });
    });
  } catch (error) {
    console.log(
      'Scheduler에 등록할 meeting을 확인하던 중 에러가 발생했습니다.',
      error,
    );
  }
};
