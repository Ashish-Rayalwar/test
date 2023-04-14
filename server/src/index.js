const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const multer = require("multer");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { dbConnection } = require("./database/db");
const userRoute = require("./routes/userRoutes");
const fileRoute = require("./routes/fileRoutes");
const orderRoute = require("./routes/orderRoutes");
require("dotenv").config();
app.use(multer().any());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/accounts", userRoute);
app.use("/api", fileRoute);
app.use("/order", orderRoute);

// app.get("/test", (req, res) => {
//   // const axios = require("axios");

//   res.redirect(
//     "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/abc/E-commerceapp-main.zip"
//   );
// });
// /api/order/file/fileID
const url = process.env.URL;

const port = 5000 || process.env.PORT;
dbConnection(url);

app.listen(port, () => {
  console.log(`server start on port ${port}`);
});
