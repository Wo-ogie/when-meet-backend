const bcrypt = require('bcrypt');
const { Meeting, Participant, Schedule } = require('../models');
const {
  createMeetingNotFoundError,
  createMeetingIsAlreadyClosedError,
  createPasswordNotMatchedError,
  createPasswordIsNullError,
} = require('../errors/meetingErrors');
const MeetingResponse = require('../dto/response/meetingResponse');
const MeetingWithParticipantsResponse = require('../dto/response/meetingWithParticipantsResponse');
const {
  createParticipantNotFoundError,
} = require('../errors/participantErrors');

const HASHING_ROUND = 12;

async function encryptPassword(password, next) {
  if (!password) {
    return next(createPasswordIsNullError());
  }
  try {
    const salt = await bcrypt.genSalt(HASHING_ROUND);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    return next(error);
  }
}

async function getMeetingById(meetingId) {
  const meeting = await Meeting.findOne({
    where: { id: meetingId },
  });
  if (!meeting) {
    throw createMeetingNotFoundError();
  }
  return meeting;
}

async function getMeetingWithParticipantsAndSchedulesById(meetingId) {
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
}

async function getParticipantByNameAndMeetingId(name, meetingId) {
  const participant = await Participant.findOne({
    where: {
      name,
      MeetingId: meetingId,
    },
  });
  if (!participant) {
    throw createParticipantNotFoundError();
  }
  return participant;
}

async function validatePasswordIsMatched(requestPassword, exPassword) {
  if (!requestPassword) {
    throw createPasswordIsNullError();
  }
  const isCorrectPassword = await bcrypt.compare(requestPassword, exPassword);
  if (!isCorrectPassword) {
    throw createPasswordNotMatchedError();
  }
}

function setParticipantDataToCookie(req, res, participant) {
  const cookieName = 'participantData';
  const cookieOptions = {
    httpOnly: true,
    signed: true,
  };

  const existCookie = req.signedCookies.participantData || null;
  if (existCookie) {
    res.clearCookie(
      cookieName,
      JSON.stringify({
        meetingId: existCookie.meetingId,
        participantId: existCookie.participantId,
      }),
      cookieOptions,
    );
  }

  res.cookie(
    cookieName,
    JSON.stringify({
      meetingId: participant.MeetingId,
      participantId: participant.id,
    }),
    cookieOptions,
  );
}

exports.createMeeting = async (req, res, next) => {
  try {
    const passwordEncrypted = await encryptPassword(
      req.body.adminPassword,
      next,
    );
    const meeting = await Meeting.create({
      title: req.body.title,
      adminPassword: passwordEncrypted,
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

exports.entry = async (req, res, next) => {
  const { meetingId } = req.params;
  const participantName = req.body.name;
  const participantPassword = req.body.password;
  try {
    const participant = await getParticipantByNameAndMeetingId(
      participantName,
      meetingId,
    );

    if (participant.password) {
      await validatePasswordIsMatched(
        participantPassword,
        participant.password,
      );
    }
    setParticipantDataToCookie(req, res, participant);
    return res.status(204).end();
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

function validateMeetingIsNotClosed(meeting) {
  if (meeting.isClosed === true) {
    throw createMeetingIsAlreadyClosedError();
  }
}

exports.closeMeeting = async (req, res, next) => {
  try {
    const meeting = await getMeetingById(req.params.meetingId);
    await validatePasswordIsMatched(
      req.body.adminPassword,
      meeting.adminPassword,
    );
    validateMeetingIsNotClosed(meeting);

    meeting.isClosed = true;
    await meeting.save();

    return res.json(MeetingResponse.from(meeting));
  } catch (error) {
    return next(error);
  }
};

exports.confirmTime = async (req, res, next) => {
  const { meetingId } = req.params;
  const { adminPassword } = req.body;
  try {
    const meeting = await getMeetingById(meetingId);
    await validatePasswordIsMatched(adminPassword, meeting.adminPassword);

    meeting.confirmedTime = Date.now();
    await meeting.save();

    return res.json(MeetingResponse.from(meeting));
  } catch (error) {
    return next(error);
  }
};
