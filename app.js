require("dotenv").config();
const express = require("express");
const app = express();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const PORT = 3000;

// create application/json parser
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));

// parse an HTML body into a string
app.use(bodyParser.text({ type: "text/html" }));

app.use(express.static(path.resolve("../public/uploads")));

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = __dirname + "/public/uploads";
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const csvFilter = (req, file, cb) => {
  if (file == undefined) {
    cb("Please upload a file to proceed.", false);
  } else if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file as only CSV is supported for now.", false);
  }
};
const uploadFile = multer({
  storage: storage,
  fileFilter: csvFilter,
});
module.exports = { uploadFile };
app.get("/", (req, res) => {
  res.send("server is working");
});
app.use("/api", require("./router/api.router"));
app.listen(PORT);
console.log("server is working at http://localhost:3000");
