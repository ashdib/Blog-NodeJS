const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// layout for admin
const adminLayout = "../views/layouts/admin";
// jwt secret
const jwtSecret = process.env.JWT_SECRET;

/**
 * Middleware
 * Check Login
 * * */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

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
router.post("/admin", async (req, res) => {
  try {
    // destructuring the username and password from the request body
    const { username, password } = req.body;
    // check the user exist in database
    const user = await User.findOne({ username });
    // check the username is exist or not
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // check the password is valid by comparing the user given password and the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //create the token for the user to cookie session
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    // if all tru redirect to dashboard
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin - Dashboard
 * Guarded by authMiddleware
 * * */
router.get("/dashboard", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description:
        "Simple blog web application with NodeJS, ExpressJS and MongoDB.",
    };
    const data = await Post.find();
    // you need to set the layout also for the dashboard
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin - Create New Post
 * Guarded by authMiddleware
 * * */
router.get("/add-post", async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description:
        "Simple blog web application with NodeJS, ExpressJS and MongoDB.",
    };
    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Create New Post
 * Guarded by authMiddleware
 * * */
router.post("/add-post", async (req, res) => {
  try {
    try {
      //TODO: Insert the post to the database
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });
      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Register
 * * */
router.post("/register", async (req, res) => {
  try {
    // destructuring the username and password from the request body
    const { username, password } = req.body;
    // TODO: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //TODO: Create User
    try {
      const user = await User.create({
        username,
        password: hashedPassword,
      });
      // send the successfull notification
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {}
  } catch (error) {
    // check if the username already exists
    if (error.code === 11000) {
      res.status(400).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
