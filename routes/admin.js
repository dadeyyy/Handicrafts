const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const Handicraft = require('../models/handicraft');
const { isLoggedIn, isAdmin } = require('../middleware');
const admin = require('../controllers/admin');

router.get('/handicrafts/admin/pending', isLoggedIn, isAdmin, catchAsync(admin.viewPendingHandicrafts));
router.post('/handicrafts/:id/validate', isLoggedIn, isAdmin, catchAsync(admin.validateHandicraft));
router.post('/handicrafts/:id/cancel', isLoggedIn, isAdmin, catchAsync(admin.cancelHandicraft));

module.exports = router;