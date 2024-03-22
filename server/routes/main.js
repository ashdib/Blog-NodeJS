const express = require("express");
const router = express.Router();

router.get("", (req, res) => {
  const locals = {
    title: "NodeJS Blog",
    description: "Simple blog web application with NodeJS, ExpressJS and MongoDB.",
  };
  res.render("index.ejs", { locals });
});

router.get("/about", (req, res) => {
  res.render("about.ejs");
});

module.exports = router;
