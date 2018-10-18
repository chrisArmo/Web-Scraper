/**
 * Mount All Routers
 */

// Dependencies -------------------- //

const router = require("express").Router();

// Routes -------------------- //

// Root
router.get("/", (req, res) => {
    res.render("index", {
        title: "Artisan Scraped News",
        home: "active"
    });
});

// Articles
router.get("/articles", (req, res) => {
    res.render("collection", {
        title: "Scraped Articles",
        subtitle: "Saved Articles",
        articles: "active"
    });
});

// Scrape
router.get("/scrape", (req, res) => {
    res.status(200).json({scraped: "success"});
});

// Export -------------------- //
 
module.exports = router;
