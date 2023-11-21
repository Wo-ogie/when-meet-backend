const bcrypt = require('bcrypt');
const { Meeting } = require('../models');
const MeetingResponse = require('../dto/response/meetingResponse');

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
