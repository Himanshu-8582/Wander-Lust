const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");   //We use double dot to reach parent directory , app.js is in parent directory and listings.js is in routes
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");


router.get("/",wrapAsync(async (req, res) => {              // Index Route
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));



router.get("/new",isLoggedIn, (req, res) => {                  // New Route
    res.render("listings/new.ejs");                       // Note:- we need to write this route 1st
});



router.get("/:id", wrapAsync(async (req, res) => {            // Show Route
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
            path: "author",
        } })
        .populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}));



router.post("/",validateListing, wrapAsync(async (req, res, next) => {               // Create Route
    const newListing = new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing is created!");
    res.redirect("/listings");
    })
);



router.get("/:id/edit",isLoggedIn,isOwner , wrapAsync(async (req, res) => {        // Edit Route
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));



router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req, res) => {                    // Update
    let { id } = req.params;
    let listing = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));



router.delete("/:id",isOwner, wrapAsync(async (req, res) => {          // Delete Route
    let { id } = req.params;               
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));

module.exports = router;
