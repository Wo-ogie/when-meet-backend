const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const {
  createMeeting,
  entry,
  getMeetingById,
  getMeetingDetailById,
  getTopThreeConfirmedTimes,
  closeMeeting,
  confirmTime,
} = require('../controllers/meeting');

const router = express.Router();

router.post('/', createMeeting);

router.get('/top-three-confirmed-times', getTopThreeConfirmedTimes);

router.post('/:meetingId/entry', entry);

router.get('/:meetingId', isAuthenticated, getMeetingById);

router.get('/:meetingId/details', isAuthenticated, getMeetingDetailById);

router.patch('/:meetingId/close', isAuthenticated, closeMeeting);

router.patch('/:meetingId/confirm-time', isAuthenticated, confirmTime);

module.exports = router;
