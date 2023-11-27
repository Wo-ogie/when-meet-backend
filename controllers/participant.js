const bcrypt = require('bcrypt');
const { createPasswordIsNullError } = require('../errors/meetingErrors');
const {
  createParticipantIsAlreadyExistError,
  createParticipantNotFoundError,
} = require('../errors/participantErrors');
const ParticipantResponse = require('../dto/response/participantResponse');
const { Participant } = require('../models');

const HASHING_ROUND = 12;

async function createParticipant(name, password, email, meetingId) {
  return Participant.create({
    name,
    password,
    email,
    MeetingId: meetingId,
  });
}

async function getParticipantById(participantId) {
  const participant = await Participant.findOne({
    where: {
      id: participantId,
    },
  });
  if (!participant) {
    throw createParticipantNotFoundError();
  }
  return participant;
}

async function findParticipantByMeetingIdAndName(meetingId, name) {
  return Participant.findOne({
    where: {
      MeetingId: meetingId,
      name,
    },
  });
}

async function getParticipantByMeetingIdAndName(meetingId, name) {
  const participant = await findParticipantByMeetingIdAndName(meetingId, name);
  if (!participant) {
    throw createParticipantNotFoundError();
  }
  return participant;
}

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

exports.createParticipant = async (req, res, next) => {
  const { meetingId } = req.params;
  const reqName = req.body.name;
  const reqPassword = req.body.password || null;
  const reqEmail = req.body.email || null;
  try {
    const existingParticipant = await findParticipantByMeetingIdAndName(
      meetingId,
      reqName,
    );
    if (existingParticipant) {
      throw createParticipantIsAlreadyExistError;
    }

    let passwordEncrypted = null;
    if (reqPassword) {
      passwordEncrypted = await encryptPassword(reqPassword, next);
    }

    const participantCreated = await createParticipant(
      reqName,
      passwordEncrypted,
      reqEmail,
      meetingId,
    );
    return res.status(201).json(ParticipantResponse.from(participantCreated));
  } catch (error) {
    return next(error);
  }
};

exports.getParticipantById = async (req, res, next) => {
  try {
    const participant = await getParticipantById(req.params.participantId);
    return res.json(ParticipantResponse.from(participant));
  } catch (error) {
    return next(error);
  }
};

exports.getParticipantByName = async (req, res, next) => {
  try {
    const participant = await getParticipantByMeetingIdAndName(
      req.params.meetingId,
      req.query.name,
    );
    return res.json(ParticipantResponse.from(participant));
  } catch (error) {
    return next(error);
  }
};

exports.getParticipantExistence = async (req, res, next) => {
  try {
    const participant = await findParticipantByMeetingIdAndName(
      req.params.meetingId,
      req.query.name,
    );
    return res.json({
      exists: !!participant,
    });
  } catch (error) {
    return next(error);
  }
};
