const express = require('express');
const {
  createParticipant,
  getParticipantExistence,
} = require('../controllers/participant');

const router = express.Router();

router.post('/:meetingId/participants', createParticipant);

router.get('/:meetingId/participants/existence', getParticipantExistence);

module.exports = router;
