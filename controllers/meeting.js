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
const ParticipantResponse = require('../dto/response/participantResponse');

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
  const meetingIdToEntry = req.params.meetingId;
  const nameToEntry = req.body.name;
  const passwordToEntry = req.body.password;
  try {
    const participant = await Participant.findOne({
      where: {
        name: nameToEntry,
        MeetingId: meetingIdToEntry,
      },
    });
    console.log('participant', participant);

    if (!participant) {
      const passwordEncrypted = await encryptPassword(passwordToEntry, next);
      const participantCreated = await Participant.create({
        name: nameToEntry,
        password: passwordEncrypted,
        email: req.body.email,
        MeetingId: meetingIdToEntry,
      });
      setParticipantDataToCookie(req, res, participantCreated);
      return res.status(201).json(ParticipantResponse.from(participantCreated));
    }

    if (participant.password) {
      await validatePasswordIsMatched(passwordToEntry, participant.password);
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

const validateMeetingIsNotClosed = (meeting) => {
  if (meeting.isClosed === true) {
    throw createMeetingIsAlreadyClosedError();
  }
};

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
