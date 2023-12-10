const express = require('express');
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

router.get('/:meetingId', getMeetingById);

router.get('/:meetingId/details', getMeetingDetailById);

router.patch('/:meetingId/close', closeMeeting);

router.patch('/:meetingId/confirm-time', confirmTime);

module.exports = router;
