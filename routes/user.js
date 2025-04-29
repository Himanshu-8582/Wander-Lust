const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local",
    {
        failureRedirect: '/login',
        failureFlash: true
    }),
    userController.login
);

router.get("/logout", userController.logout);

module.exports = router;










// router.get("/signup", userController.renderSignUpForm);

// router.post("/signup", wrapAsync(userController.signUp));

// router.get("/login",userController.renderLoginForm);

// // password.authenticate() :- auto-check for password from db
// router.post("/login",saveRedirectUrl, passport.authenticate("local",
//     {
//         failureRedirect: '/login',
//         failureFlash: true
//     }),
//     userController.login
// );

// router.get("/logout", userController.logout);