const Handicraft = require('../models/handicraft');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const handicraft = await Handicraft.findById(req.params.id).populate('reviews')
    const review = new Review(req.body.review);
    review.author = req.user._id;
    handicraft.reviews.push(review);
    await review.save()
    await handicraft.save()
    req.flash('success', 'Successfully Created Review')
    res.redirect(`/handicrafts/${handicraft._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Handicraft.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully Deleted')
    res.redirect(`/handicrafts/${id}`)
}

module.exports.editReviewForm = async (req,res) =>{
    const {id, author} = req.params;
    const foundAuthor = await Review.findOne({_id: author})
    res.render('handicrafts/editReview.ejs', {foundAuthor,id});
}

