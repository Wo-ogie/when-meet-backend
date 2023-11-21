const bcrypt = require('bcrypt');
const { Meeting, Participant, Schedule } = require('../models');
const {
  getMeetingNotFoundError,
  getMeetingIsAlreadyClosedError,
  getAdminPasswordNotMatchedError,
} = require('../errors/meetingErrors');
const MeetingResponse = require('../dto/response/meetingResponse');
const MeetingWithParticipantsResponse = require('../dto/response/meetingWithParticipantsResponse');

const HASHING_ROUND = 12;

const getMeetingById = async (meetingId) => {
  const meeting = await Meeting.findOne({
    where: { id: meetingId },
  });
  if (!meeting) {
    throw getMeetingNotFoundError();
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
    throw getMeetingNotFoundError();
  }
  return meeting;
};

exports.createMeeting = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(HASHING_ROUND);
    const hash = await bcrypt.hash(req.body.adminPassword, salt);
    const meeting = await Meeting.create({
      title: req.body.title,
      adminPassword: hash,
      purpose: req.body.purpose,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      maxParticipants: req.body.maxParticipants,
      voteExpiresAt: req.body.voteExpiresAt,
    });
    return res.status(201).json(MeetingResponse.from(meeting));
  } catch (error) {
    return next(error);
  }
};

exports.getMeetingById = async (req, res, next) => {
  try {
    const meeting = await getMeetingById(req.params.meetingId);
    return res.json(MeetingResponse.from(meeting));
  } catch (error) {
    return next(error);
  }
};

exports.getMeetingDetailById = async (req, res, next) => {
  try {
    const meeting = await getMeetingWithParticipantsAndSchedulesById(
      req.params.meetingId,
    );
    return res.json(MeetingWithParticipantsResponse.from(meeting));
  } catch (error) {
    return next(error);
  }
};

const validateAdminPassword = async (
  requestAdminPassword,
  meetingAdminPassword,
) => {
  const isCorrectPassword = await bcrypt.compare(
    requestAdminPassword,
    meetingAdminPassword,
  );
  if (!isCorrectPassword) {
    throw getAdminPasswordNotMatchedError();
  }
};

const validateMeetingIsNotClosed = (meeting) => {
  if (meeting.isClosed === true) {
    throw getMeetingIsAlreadyClosedError();
  }
};

exports.closeMeeting = async (req, res, next) => {
  try {
    const meeting = await getMeetingById(req.params.meetingId);
    await validateAdminPassword(req.body.adminPassword, meeting.adminPassword);
    validateMeetingIsNotClosed(meeting);

    meeting.isClosed = true;
    await meeting.save();

    return res.json(MeetingResponse.from(meeting));
  } catch (error) {
    return next(error);
  }
};
