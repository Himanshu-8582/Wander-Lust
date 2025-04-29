const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {              // Index Route
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {            // New Route
    res.render("listings/new.ejs");                       // Note:- we need to write this route 1st
};

module.exports.showListings= async (req, res) => {            // Show Route
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
}

module.exports.createListings = async (req, res, next) => {               // Create Route
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url , ".." , filename);
    const newListing = new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing is created!");
    res.redirect("/listings");
};

module.exports.renderEditForm= async (req, res) => {        // Edit Route
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListings = async (req, res) => {                    // Update
    let { id } = req.params;
    let listing = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListings = async (req, res) => {          // Delete Route
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};