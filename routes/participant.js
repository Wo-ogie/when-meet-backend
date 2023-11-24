const express = require('express');
const {
  createParticipant,
  getParticipantByName,
  getParticipantById,
  getParticipantExistence,
} = require('../controllers/participant');

const router = express.Router();

router.post('/:meetingId/participants', createParticipant);

router.get('/:meetingId/participants', getParticipantByName);

router.get('/:meetingId/participants/:participantId', getParticipantById);

router.get('/:meetingId/participants/existence', getParticipantExistence);

module.exports = router;
