const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const {
  createMeeting,
  entry,
  getMeetingById,
  getMeetingDetailById,
  closeMeeting,
} = require('../controllers/meeting');

const router = express.Router();

router.post('/', createMeeting);

router.post('/:meetingId/entry', entry);

router.get('/:meetingId', isAuthenticated, getMeetingById);

router.get('/:meetingId/details', isAuthenticated, getMeetingDetailById);

router.patch('/:meetingId/close', isAuthenticated, closeMeeting);

module.exports = router;
