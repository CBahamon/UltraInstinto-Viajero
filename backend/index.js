const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require("./routes/users.routes")
const pinRoute = require("./routes/pins.routes")
const app = express();


dotenv.config();

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true
    })
    .then(() => {
        console.log('mongo connect');
    })
    .catch((err) => console.log(err));

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.listen(8800, () => {
    console.log("Backend server is running!");
            });