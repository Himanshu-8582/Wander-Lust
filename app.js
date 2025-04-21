const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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

app.use("/listings", listings);   // We can import all routes using router ("./routes/listing.js")
app.use("/listings/:id/reviews", reviews);     // We can import all routes using router (""/listings/:id/reviews"")


//MiddleWares
app.all("*", (req, res, next) => {       //MiddleWare
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, erq, res, next) => {       //MiddleWare we use it for error handling     
    let { statusCode=500, message="Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
})

app.listen(8080, () => {
    console.log("Server is listening to port 8080.");
})