require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const session = require("express-session");
const connectDB = require("./server/config/db");
const cookieParser = require("cookie-parser");
const {isActiveRoute} = require("./server/helpers/routeHelpers");
// Store session in the MongoDB
const MongoStore = require("connect-mongo");
// Connect to database
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve the public folder for style, image and js
app.use(express.static("public"));
// cookie parser for create session when user login
app.use(cookieParser());
app.use(methodOverride("_method"));
// session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
    //setTime for the cookie session
    // cookie: {
    //   maxAge: 1000 * 60 * 60 * 24, // 1 day
    // },
  })
);

// Templating engine
// Initialise middleware of expressLayout and set the default layout tho the main.js at layout folder
app.use(expressLayout);
// check the layout folder for the layout
// there is no need to connect to views folder as it is the default folder
app.set("layout", "./layouts/main");
// set the frontend which is ejs
app.set("view engine", "ejs");
app.locals.isActiveRoute = isActiveRoute;
// connect to the routes with middleware
app.use("/", require("./server/routes/main"));
// connect to the admin routes
app.use("/", require("./server/routes/admin"));

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
