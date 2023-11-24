const express = require('express');
const { createParticipant } = require('../controllers/participant');

const router = express.Router();

router.post('/:meetingId/participants', createParticipant);

module.exports = router;
