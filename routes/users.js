const express = require('express');
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../helpers/catchAsync')
const passport = require('passport');
const Review = require('../models/review');
const Handicraft = require('../models/handicraft');
const users = require('../controllers/users')

router.get('', users.home)

router.route('/register')
    .get( users.renderRegister)
    .post( catchAsync(users.register));

// console.log(average._pipeline[0]['$group'].average['$avg']);
// const agre = Review.aggregate([{$group: {_id:null, average:{$avg:"$rating"}}}]);

router.route('/login')
    .get( users.renderLogin)
    .post( passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)


router.get('/logout', users.logout)


module.exports = router;