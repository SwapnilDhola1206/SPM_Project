const MeditationCenter = require('../models/meditationCenter');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const meditationCenter = await MeditationCenter.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    meditationCenter.reviews.push(review);
    await review.save();
    await meditationCenter.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/meditationCenters/${meditationCenter._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await MeditationCenter.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/meditationCenters/${id}`);
}
