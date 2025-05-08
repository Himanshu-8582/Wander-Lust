if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;

async function main() {                                        // Mongodb connection
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dburl);                              // This time our DB is connected to atlasdb
}

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

// using Sessions

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 3600*24,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,

    }
}

app.use(session(sessionOptions));     // We always use passport after using sessions
app.use(flash());                     //We use flash using routes So we need to use flash first
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());   //Serialize users into the session (stores in the session)
passport.deserializeUser(User.deserializeUser());   // opposite of deserialization

// ROUTES 
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings", listingsRouter);   // We can import all routes using router ("./routes/listing.js")
app.use("/listings/:id/reviews", reviewsRouter);     // We can import all routes using router (""/listings/:id/reviews"")
app.use("/", userRouter);


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