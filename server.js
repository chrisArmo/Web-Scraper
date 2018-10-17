/**
 * Web Scraper Server
 */

// Dependencies --------------------/

// Third party
const axios = require("axios"),
    bodyParser = require("body-parser"),
    cheerio = require("cheerio"),
    cookieParser = require("cookie-parser"),
    express = require("express"),
    exphbs = require("express-handlebars"),
    mongoose = require("mongoose");

// Modules
const db = require("./models");

// Components --------------------/

// Express app
const app = express();
    // Server port
    port = process.env.PORT || 3000;

// Setup --------------------/

// Set static directory
app.use(express.static("public"));

// Create view instance
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {}
});

// Set view engine
app.engine(hbs.extname, hbs.engine);
app.set("view engine", hbs.extname);

// Use parsers
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// Connect with mongoose
mongoose.connect("mongodb://localhost/webArticles", {useNewUrlParser: true});

// Router --------------------/


// Server Listen --------------------/

app.listen(port, () => {
    console.log(`Web Scraper application running on port ${port}`);
});
