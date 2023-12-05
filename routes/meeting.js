const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const {
  createMeeting,
  entry,
  getMeetingById,
  getMeetingDetailById,
  getMostConfirmedTime,
  closeMeeting,
  confirmTime,
} = require('../controllers/meeting');

const router = express.Router();

router.post('/', createMeeting);

router.get('/most-confirmed-time', getMostConfirmedTime);

router.post('/:meetingId/entry', entry);

router.get('/:meetingId', isAuthenticated, getMeetingById);

router.get('/:meetingId/details', isAuthenticated, getMeetingDetailById);

router.patch('/:meetingId/close', isAuthenticated, closeMeeting);

router.patch('/:meetingId/confirm-time', isAuthenticated, confirmTime);

module.exports = router;
