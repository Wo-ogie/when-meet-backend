const bcrypt = require('bcrypt');
const { Meeting, Participant, Schedule } = require('../models');
const MeetingResponse = require('../dto/response/meetingResponse');
const MeetingWithParticipantsResponse = require('../dto/response/meetingWithParticipantsResponse');

exports.createMeeting = async (req, res, next) => {
  try {
    const HASHING_ROUND = 12;
    const salt = bcrypt.genSaltSync(HASHING_ROUND);
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
    console.error(error);
    return next(error);
  }
};

exports.getMeetingById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findOne({
      where: { id: req.params.meetingId },
    });
    if (!meeting) {
      const error = new Error('일치하는 약속을 찾을 수 없습니다.');
      error.status = 404;
      next(error);
    }
    res.json(MeetingResponse.from(meeting));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getMeetingDetailById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findOne({
      where: { id: req.params.meetingId },
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
      const error = new Error('일치하는 약속을 찾을 수 없습니다.');
      error.status = 404;
      next(error);
    }

    console.log(meeting);
    res.json(MeetingWithParticipantsResponse.from(meeting));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
