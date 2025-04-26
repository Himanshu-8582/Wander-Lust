const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// File to reset data in DB
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

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>( {
        ...obj,
        owner: "680cc50bba0e30ffa896812c",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized.");
};

initDB();