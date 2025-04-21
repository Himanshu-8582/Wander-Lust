const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");  //We use double dot to reach parent directory , app.js is in parent directory and listings.js is in routes


const validateListing = (req, res, next) => {              //validation Method for Creating and Updating listings
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,error);
    } else next();
}


router.get("/",wrapAsync(async (req, res) => {                 // Index Route
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
}));

router.get("/new", (req, res) => {                  // New Route 
    res.render("listings/new.ejs");                       // Note:- we need to write this route 1st
});

router.get("/:id", wrapAsync(async (req, res) => {            // Show Route
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));


router.post("/",validateListing, wrapAsync(async (req, res, next) => {               // Create Route
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    })
);

router.get("/:id/edit", wrapAsync(async (req, res) => {        // Edit Route
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

router.put("/:id",validateListing,wrapAsync(async (req, res) => {                    // Update
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id", wrapAsync(async (req, res) => {          // Delete Route
    let { id } = req.params;               
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;
