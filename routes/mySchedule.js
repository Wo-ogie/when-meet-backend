const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const {
  createMySchedules,
  getMySchedules,
} = require('../controllers/schedule');

const router = express.Router({ mergeParams: true });

router.post('/bulk', isAuthenticated, createMySchedules);

router.get('/', isAuthenticated, getMySchedules);

module.exports = router;
