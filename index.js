const express = require("express");
const bodyParser = require("body-parser");

const port = 3000;
const app = express();
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let extractedParameter;

app.use("/submit", (req, res, next) => {
  try {
    let params = new URL(req.body.url).searchParams;
    if (params.get(req.body.param)) {
      extractedParameter = params.get(req.body.param);
    } else {
      extractedParameter = null;
    }
  } catch (error) {
    console.error(error);
  }

  res.redirect("/");
  next();
});

app.get("/", (req, res) => {
  res.render("index.ejs", {
    extractedParameter: extractedParameter
  });
});

app.listen(port, (req, res) => {
  console.log(`App running on port ${port}.`);
});

module.exports = app;