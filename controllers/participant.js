const bcrypt = require('bcrypt');
const { Participant } = require('../models');
const { createPasswordIsNullError } = require('../errors/meetingErrors');
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

exports.createParticipant = async (req, res, next) => {
  console.log(req.params);
  const { meetingId } = req.params;
  const reqName = req.body.name;
  const reqPassword = req.body.password || null;
  const reqEmail = req.body.email || null;
  console.log(meetingId);
  console.log(reqName);
  console.log(reqPassword);
  console.log(reqEmail);
  try {
    const existingParticipant = await Participant.findOne({
      where: {
        MeetingId: meetingId,
        name: reqName,
      },
    });
    if (existingParticipant) {
      throw new Error();
    }

    let passwordEncrypted = null;
    if (reqPassword) {
      passwordEncrypted = await encryptPassword(reqPassword, next);
    }

    const participantCreated = await Participant.create({
      name: reqName,
      password: passwordEncrypted,
      email: reqEmail,
      MeetingId: meetingId,
    });
    return res.status(201).json(ParticipantResponse.from(participantCreated));
  } catch (error) {
    return next(error);
  }
};
