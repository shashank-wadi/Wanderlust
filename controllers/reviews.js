const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReviews=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    const review = new Review({
        rating: req.body.review.rating,  
        comment: req.body.review.comment,
        author: req.user._id 
    });
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
  };
  
module.exports.ShowReviews=async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: { path: "author" } 
        })
        .populate("owner");
  
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
  
    console.log("Listing found:", listing);
    res.render("show", { listing, currUser: req.user });
  };

module.exports.deleteReviews=async (req, res) => {
    const { id, reviewId } = req.params;
  
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
  
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
  };