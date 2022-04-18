const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const moment = require("moment");
const reload = require("reload");
const mainPages = require("./mainpages");
const muzRoutes = require("./routes/muzRoutes");
const ejs = require("ejs");

const app = express();
dotenv.config();

app.locals.moment = moment;
app.locals.ejs = ejs;

const dbURI = process.env.MONGO_URI;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Connected to database");

    app.listen(4000);
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// load static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Home", mainPages, req_url: req.url });
});

// load song routes
app.use("/muz-center", muzRoutes);
app.get("/muz", (req, res) => {
  res.redirect("/muz-center");
});

reload(app);

// 404 page middleware
app.use((req, res) => {
  res.status(404).render("404", { title: "404", mainPages, req_url: req.url });
});
