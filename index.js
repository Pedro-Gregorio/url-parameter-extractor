const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = 3000;
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.post("/submit", (req, res) => {
  let extractedParameter;
  let url = req.body.url;
  let paramToSearch = req.body.param;

  var queryString = url.split("?")[1];

  if (!queryString) {
    extractedParameter = "";
  } else {
    
    let queryArray = queryString.split("&");
    let queryParams = {};
    queryArray.forEach(function (pair) {
      var [key, value] = pair.split("=");
      queryParams[decodeURIComponent(key)] = decodeURIComponent(value || "");
    });
    
    extractedParameter = queryParams[paramToSearch] || "";
    console.log(extractedParameter === "")
  }

  req.session.extractedParameter = extractedParameter;
  res.redirect("/");
});

app.get("/", (req, res) => {
  const extractedParameter = req.session.extractedParameter;
  console.log(extractedParameter)
  res.render("index.ejs", { extractedParameter: extractedParameter });
});

app.listen(port, (req, res) => {
  console.log(`App running on port ${port}.`);
});

module.exports = app;
