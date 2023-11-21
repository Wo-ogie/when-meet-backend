const express = require('express');
const { createMeeting } = require('../controllers/meeting');

const router = express.Router();

router.post('/', createMeeting);

module.exports = router;
