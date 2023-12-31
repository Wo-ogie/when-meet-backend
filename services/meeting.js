const { sendMeetingVoteEndNotificationEmail } = require('./mail');
const { Meeting, Participant, Schedule } = require('../models');
const { createMeetingNotFoundError } = require('../errors/meetingErrors');

const getMeetingById = async (meetingId) => {
  const meeting = await Meeting.findOne({
    where: { id: meetingId },
  });
  if (!meeting) {
    throw createMeetingNotFoundError();
  }
  return meeting;
};

const getMeetingWithParticipantsById = async (meetingId) => {
  const meeting = await Meeting.findOne({
    where: { id: meetingId },
    include: [
      {
        model: Participant,
      },
    ],
  });
  if (!meeting) {
    throw createMeetingNotFoundError();
  }
  return meeting;
};

const getMeetingWithParticipantsAndSchedulesById = async (meetingId) => {
  const meeting = await Meeting.findOne({
    where: { id: meetingId },
    include: [
      {
        model: Participant,
        include: [
          {
            model: Schedule,
          },
        ],
      },
    ],
  });
  if (!meeting) {
    throw createMeetingNotFoundError();
  }
  return meeting;
};

const getNumOfParticipantsByMeetingId = async (meetingId) =>
  Participant.count({
    where: {
      MeetingId: meetingId,
    },
  });

const setMeetingClosedAndSendVoteEndEmail = async (meetingId) => {
  const meeting = await getMeetingWithParticipantsById(meetingId);

  if (meeting.isClosed) {
    return;
  }

  meeting.isClosed = true;
  await meeting.save();

  await Promise.all(
    meeting.Participants.filter((participant) => participant.email).map(
      (participant) =>
        sendMeetingVoteEndNotificationEmail(participant.email, meetingId),
    ),
  );
};

module.exports = {
  getMeetingById,
  getMeetingWithParticipantsById,
  getMeetingWithParticipantsAndSchedulesById,
  getNumOfParticipantsByMeetingId,
  setMeetingClosedAndSendVoteEndEmail,
};
