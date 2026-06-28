const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  }),
);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});
