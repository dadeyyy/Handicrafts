const express = require('express');
const router = express.Router({ mergeParams: true });
const Handicraft = require('../models/handicraft');
const Review = require('../models/review');
const catchAsync = require('../helpers/catchAsync')
const ExpressError = require('../helpers/ExpressError')
const { reviewSchema } = require('../schemas.js')
const { isLoggedIn, validateReview, isReviewAuthor , checkVisitorRole } = require('../middleware')
const reviews = require('../controllers/reviews');

router.get('/:author/edit', isLoggedIn, checkVisitorRole,  catchAsync(reviews.editReviewForm))

router.post('/', isLoggedIn, checkVisitorRole,  validateReview, catchAsync(reviews.createReview)) 

router.put('/:author', isLoggedIn, checkVisitorRole, validateReview, catchAsync(reviews.editReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;