require('dotenv').config()
console.log(process.env.MONGO_URL);
const express = require("express");
const { CourseRouter } = require("./routes/course");
const { UserRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { ChannelRouter, ChannelsListRouter } = require("./routes/channel");
const mongoose = require("mongoose");

// Allow populate('lectures') etc. without strict path errors
mongoose.set("strictPopulate", false);

const cors = require("cors");

const app=express();
app.use(cors());

app.use(express.json());

app.use("/user", UserRouter);
app.use("/admin", adminRouter);
app.use("/course", CourseRouter);
app.use("/channels", ChannelsListRouter);
app.use("/channel", ChannelRouter);



async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB:", mongoose.connection.name);

        app.listen(3000, () => {
            console.log("Server started on port 3000");
        });

    } catch (err) {
        console.log("DB connection error:", err);
    }
}

main();


