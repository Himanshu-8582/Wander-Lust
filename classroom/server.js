const express = require("express");
const app = express();
const posts = require("./route/posts.js");
const users = require("./route/users.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));
app.get("/getsignedcookie", (req, res) => {
    res.cookie("made-in", "India", { signed: true });
    res.send("signed cookie sent");
});

app.get("/verify", (req, res) => {
    console.log(req.signedCookies);
    res.send("verified");
})

app.get("/getcookie", (req, res) => {
    res.cookie("greet", "hello");
    res.send("Sent you some cookies!");
});

app.get("/greet", (req, res) => {
    let { madeIn = "nothing" } = req.cookies;
    res.send(`hi, ${madeIn}`);
});

app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi, I am root.");
});

app.use("/users", users);
app.use("/posts", posts);


app.listen(3000, () => {
    console.log("Server is listening to 3000");
});