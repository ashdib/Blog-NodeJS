const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

// layout for admin
const adminLayout ="../views/layouts/admin";
/**
 * GET /
 * Admin - Login page
 * * */
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description:
        "Simple blog web application with NodeJS, ExpressJS and MongoDB.",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Check Login
 * * */

module.exports = router;
