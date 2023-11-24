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

router.get('/:participantId', getParticipantById);

router.get('/existence', getParticipantExistence);

module.exports = router;
