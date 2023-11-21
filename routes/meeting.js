const express = require('express');
const {
  createMeeting,
  getMeetingById,
  getMeetingDetailById,
  closeMeeting,
} = require('../controllers/meeting');

const router = express.Router();

router.post('/', createMeeting);

// TODO: 접근 권한 확인 로직 추가 필요
router.get('/:meetingId', getMeetingById);

// TODO: 접근 권한 확인 로직 추가 필요
router.get('/:meetingId/details', getMeetingDetailById);

// TODO: 접근 권한 확인 로직 추가 필요
router.patch('/:meetingId/close', closeMeeting);

module.exports = router;
