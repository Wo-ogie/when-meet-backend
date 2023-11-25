const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const {
  createMySchedules,
  getMySchedules,
  updateMySchedules,
} = require('../controllers/schedule');

const router = express.Router({ mergeParams: true });

router.post('/bulk', isAuthenticated, createMySchedules);

router.get('/', isAuthenticated, getMySchedules);

router.put('/bulk', isAuthenticated, updateMySchedules);

module.exports = router;
