const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const review = require("./models/review.js");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://localhost:27017/wanderlust";
async function main() {                                        // Mongodb connection
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

  // ROUTES 
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,error);
    } else next();
}

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,error);
    } else next();
}


app.get("/listings",wrapAsync(async (req, res) => {                 // Index Route
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
}));

app.get("/listings/new", (req, res) => {                  // New Route 
    res.render("listings/new.ejs");                       // Note:- we need to write this route 1st
});

app.get("/listings/:id", wrapAsync(async (req, res) => {            // Show Route
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

app.post("/listings",validateListing, wrapAsync(async (req, res, next) => {               // Create Route
    // try{
    //     const newListing = new Listing(req.body.listing);              // Without wrapAsync function
    //     await newListing.save();
    //     res.redirect("/listings");
    // } catch (err) {
    //     next(err);
    // }

    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    })
);

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {        // Edit Route
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

app.put("/listings/:id",validateListing,wrapAsync(async (req, res) => {                    // Update
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {          // Delete Route
    let { id } = req.params;               
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//Review
// Review Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing.id}`);
}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, erq, res, next) => {
    let { statusCode=500, message="Something went wrong" } = err;
    // res.send("Something went wrong");
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("Server is listening to port 8080.");
})