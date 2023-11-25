const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { createMySchedules } = require('../controllers/schedule');

const router = express.Router({ mergeParams: true });

router.post('/bulk', isAuthenticated, createMySchedules);

module.exports = router;
