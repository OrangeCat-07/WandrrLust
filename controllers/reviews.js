const Listing = require("../models/listings");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing =await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    
    // First, find and delete the review
    let review = await Review.findByIdAndDelete(reviewId);
    
    // Then, update the listing to remove the review reference
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};