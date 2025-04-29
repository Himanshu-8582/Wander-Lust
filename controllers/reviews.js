const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);        // Syntax to add reviws obj inside listing.review array
    // console.log(newReview);
    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    req.flash("success", "New Review is created!");
    res.redirect(`/listings/${listing.id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is Deleted!");
    res.redirect(`/listings/${id}`);
};