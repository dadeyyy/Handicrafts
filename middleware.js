const {handicraftSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./helpers/ExpressError');
const Handicraft = require('./models/handicraft');
const Review = require('./models/review');
const User = require('./models/user')

module.exports.isLoggedIn = (req,res,next )=>{
    
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('erorr', 'You are not signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateHandicraft = (req,res,next) =>{
    const {error} = handicraftSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

module.exports.isAuthor = async(req,res, next)=>{
    const {id} = req.params;
    const handicraft = await Handicraft.findById(id);
    if((!handicraft.author.equals(req.user._id)) && (req.user.username !== 'admin')){
        req.flash('error', 'You do not have permission');
        return res.redirect(`/handicrafts/${id}`)
    }
    // else if((handicraft.author.equals(req.user._id)) || (req.user.username.equals('admin'))){
    //     return next();
    // }
    next();
}

module.exports.validateReview = (req,res, next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res, next)=>{
    const {id ,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission');
        return res.redirect(`/handicrafts/${id}`)
    }
    next();
}

module.exports.isAdmin = (req,res,next) =>{
    if(!req.user || req.user.username !== 'admin'){
        req.flash('error', 'You do not have permission');
        return res.redirect('/');
    }
    next();
}

module.exports.checkVisitorRole = (req, res, next) => {
    const role = req.user.role;
  
    if (role !== 'visitor') {
      return res.status(403).json({ message: 'Only visitors are allowed to make reviews.' });
    }
    next();
  };

  module.exports.checkStoreOwnerRole = (req,res,next) => {
    const role = req.user.role;
  
    if(role !== 'store_owner') {
      req.flash('error', 'You are not a store owner!')
      return res.redirect('/handicrafts')
    }
  
    next();
  }