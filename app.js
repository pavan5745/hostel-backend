const express = require("express");
const app = express();
const hostelRouter = require("./routes/hostelRoutes.js");
const hostlerRouter = require("./routes/hostlerRoutes.js");
const cors = require("cors");
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // React frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use("/api/v1/hostel", hostelRouter);

app.use("/api/v1/hostler", hostlerRouter);
module.exports = app;
