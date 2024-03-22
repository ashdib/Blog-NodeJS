require('dotenv').config();


const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const expressLayout = require('express-ejs-layouts');

// serve the public folder for style, image and js
app.use(express.static('public'));

// Templating engine
// Initialise middleware of expressLayout and set the default layout tho the main.js at layout folder
app.use(expressLayout);
// check the layout folder for the layout
// there is no need to connect to views folder as it is the default folder
app.set("layout", "./layouts/main");
// set the frontend which is ejs
app.set("view engine", "ejs");

// connect to the routes with middleware
app.use("/", require("./server/routes/main"));


app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT}`);
})