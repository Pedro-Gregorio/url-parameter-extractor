const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require('dotenv').config();

const port = 3000;
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET_KEY, // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure: true if using HTTPS
  })
);

app.post("/submit", (req, res) => {
  let extractedParameter;
  try {
    let params = new URL(req.body.url).searchParams;
    extractedParameter = params.get(req.body.param) || "";
  } catch (error) {
    console.error(error);
    extractedParameter = "";
  }

  req.session.extractedParameter = extractedParameter;
  res.redirect("/");
});

app.get("/", (req, res) => {
  const extractedParameter = req.session.extractedParameter || null;
  res.render("index.ejs", { extractedParameter: extractedParameter });
});

app.listen(port, (req, res) => {
  console.log(`App running on port ${port}.`);
});

module.exports = app;
