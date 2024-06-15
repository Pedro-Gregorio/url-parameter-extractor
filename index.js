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

  var queryString = url.split("?")[1];

  if (!queryString) {
    extractedParameters = "";
  } else {
    
    let queryArray = queryString.split("&");
    let queryParams = {};
    queryArray.forEach(function (pair) {
        var equalsPosition = pair.indexOf('=');
        
        var key, value;
        if (equalsPosition === -1) {
            key = pair;
            value = '';
        } else {
            key = pair.slice(0, equalsPosition);
            value = pair.slice(equalsPosition + 1);
        }
        queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
    extractedParameters = queryParams;
  }

  req.session.url = url;
  req.session.extractedParameters = extractedParameters;
  res.redirect("/");
});

app.get("/", (req, res) => {
  const url = req.session.url;
  const extractedParameters = req.session.extractedParameters;
  
  res.render("index.ejs", { url: url, extractedParameters: extractedParameters });
});

app.listen(port, (req, res) => {
  console.log(`App running on port ${port}.`);
});

module.exports = app;
