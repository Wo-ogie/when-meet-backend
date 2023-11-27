const express = require('express');
const {
  createParticipant,
  getParticipantByName,
  getParticipantById,
  getParticipantExistence,
} = require('../controllers/participant');

const router = express.Router({ mergeParams: true });

router.post('/', createParticipant);

router.get('/', getParticipantByName);

router.get('/existence', getParticipantExistence);

router.get('/:participantId', getParticipantById);

module.exports = router;
