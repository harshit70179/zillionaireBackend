const express = require("express");
const app = express();
let db = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/static", express.static("public"));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api/v1/admin",require("./routes/admin"))
app.use("/api/v1/user",require("./routes/user"))


let port =process.env.port || 8082;
app.listen(port, () => {
  console.log(`Server up and running on port ${port} !`);
});