const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");   //We use double dot to reach parent directory , app.js is in parent directory and listings.js is in routes
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');

const { storage } = require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' });    // Creates a Upload folder And Stores All files there
const upload = multer({storage});   // Stores Files In Cloudinary

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListings));
    

// New Route: 1st of all We need to use this path to connect with our DataBase
router.get("/new", isLoggedIn, listingController.renderNewForm);
    
router.route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListings))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListings));

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner , wrapAsync(listingController.renderEditForm));

module.exports = router;














// Index route
// router.get("/",wrapAsync(listingController.index));

// Show Route
// router.get("/:id", wrapAsync(listingController.showListings));

// Create Route
// router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListings));



// Update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListings));

// Delete Route
// router.delete("/:id", isOwner, wrapAsync(listingController.destroyListings));


