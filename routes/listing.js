const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");
const listingController=require('../controllers/listings')
const reviewController=require("../controllers/reviews")

const multer=require('multer')
const{storage}=require("../cloudConfig");

const upload=multer({storage})
// Get All Listings
router.get("/", wrapAsync(listingController.index));

// New Listing Form
router.get("/new", isLoggedIn,listingController.newListing);

// Show Listing Details 
router.get("/:id", wrapAsync(listingController.showListings));

// Create New Listing
router.post("/", isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.createNewListing));

// Edit Listing Form
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListings));

// Update Listing
router.put("/:id", isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.updateListings));

// Delete Listing
router.delete("/:id", isLoggedIn, wrapAsync(listingController.deleteListings));


// create a Review
router.post("/:id/reviews", isLoggedIn, wrapAsync(reviewController.createReviews));

// Show reviews
router.get("/:id", wrapAsync(reviewController.ShowReviews));


// Delete a Review
router.delete("/:id/reviews/:reviewId", isLoggedIn, wrapAsync(reviewController.deleteReviews));

module.exports = router;
