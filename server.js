/**
 * Web Scraper Server
 */

// Dependencies -------------------- //

// Third party
const bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    express = require("express"),
    exphbs = require("express-handlebars"),
    mongoose = require("mongoose");

// Modules
const router = require("./routes");

// Components -------------------- //

// Express app
const app = express();
    // Server port
    port = process.env.PORT || 3000,
    // Mongo connection path
    connectionPath = process.env.MONGODB_URI || "mongodb://localhost/webArticles";

// Setup -------------------- //

// Set static directory
app.use(express.static("public"));

// Create view instance
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
        getCurrentDate() {
            return new Date().getFullYear();
        }
    }
});

// Set view engine
app.engine(hbs.extname, hbs.engine);
app.set("view engine", hbs.extname);

// Use parsers
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// Connect with mongoose
mongoose.connect(connectionPath, {useNewUrlParser: true});

// Router -------------------- //

app.use(router);

// Server Listen -------------------- //

app.listen(port, () => {
    console.log(`Web Scraper application running on port ${port}`);
});
