const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJS Blog",
      description:
        "Simple blog web application with NodeJS, ExpressJS and MongoDB.",
    };

    // TODO: Create pagination for the posts
    let perPage = 6;
    let page = req.query.page || 1;
    //                                   sort the posts by createdAt in descending order
    /**
     * Represents the aggregated data obtained from the database.
     * @typedef {Object[]} AggregatedData
     * @property {number} createdAt - The creation timestamp of the post.
     * @property {string} // add more properties as needed
     */

    /**
     * Retrieves aggregated data from the database.
     * Retrieve the data posts from the database and sort them in descending order based on the creation timestamp.
     * @returns {Promise<AggregatedData>} The aggregated data.
     */
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      // skip over the post that come before the current page. Eg: if the user navigate to page 3, it will skip the first 20 posts
      .skip(perPage * page - perPage)
      // limit the number of documents returned to the number of posts per page.
      .limit(perPage)
      // executes the aggregation pipeline and returns a promise that resolves to the result data
      .exec();
    // to count the number/total number of posts in the database
    const count = await Post.countDocuments();
    // calculate the number for the next page
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index.ejs", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about.ejs", {
    currentRoute: `/post/${slug}`,
  });
});

/**
 * Get /
 * Post : id **/
// TODO: Connect every post's article with a LINK to a page contain the content/body of the post of the post
router.get("/post/:id", async (req, res) => {
  try {
    const slug = req.params.id;
    const data = await Post.findById({ _id: slug });
    const locals = {
      title: data.title,
      description:
        "Simple blog web application with NodeJS, ExpressJS and MongoDB.",
      currentRoute: `/post/${slug}`,
    };
    res.render("post.ejs", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

/**
 * Search Form for post
 * POST /
 * Post : searchTerm **/
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "NodeJS Blog",
      description:
        "Simple blog web application with NodeJS, ExpressJS and MongoDB.",
    };
    let searchTerm = req.body.searchTerm;
    // Remove special characters from the search term
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    // Perform a query to search for the post that contains the search term
    const data = await Post.find({
      // OR operation on array of two or more expressions and selects the documents that satisfy at least one of the expressions.
      $or: [
        // It matches documents where the title field matches the regular expression
        // The "i" flag makes the search case-insensitive.
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    res.render("search", { data, locals });

    // res.send(searchTerm);
    // With only this code, the searchTerm is unable to pass data to frontend
    // To pass the data we need to navigate to app.js
  } catch (error) {
    console.log(error);
  }
});

// TODO: Test out to retrieve data from the MongoDB
// router.get("", async (req, res) => {
//   const locals = {
//     title: "NodeJS Blog",
//     description:
//       "Simple blog web application with NodeJS, ExpressJS and MongoDB.",
//   };

//   try {
//     //TODO: Display the list of posts from the MongoDB
//     const data = await Post.find();
//     res.render("index.ejs", { locals, data });
//   } catch (error) {
//     console.log(error);
//   }
// });

// TODO: Test out the Post model & adding data to the MongoDB
// Create a function to insert title and body data to the MongoDB
// function InsertPostData() {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js",
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments...",
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries.",
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications.",
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js.",
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications.",
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations.",
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers.",
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic.",
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan.",
//     },
//   ]);
// }
// InsertPostData();

module.exports = router;
