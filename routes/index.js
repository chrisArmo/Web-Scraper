/**
 * Mount All Routers
 */

// Dependencies -------------------- //

const axios = require("axios"),
    cheerio = require("cheerio"),
    router = require("express").Router();
const db = require("../models");

// Routes -------------------- //

// Root
router.get("/", (req, res) => {
    db.Article
        .find()
        .count()
        .then((count) => {
            res.render("index", {
                title: "Artisan Scraped News",
                home: "active",
                scraped: count > 0
            });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// Articles
router.get("/articles", (req, res) => {
    db.Article
        .find({})
        .then((scrapedArticles) => {
            res.status(200).render("collection", {
                title: "Scraped Articles",
                subtitle: "Saved Articles",
                articles: "active",
                scrapedArticles
            });
        })
        .catch((err) => {
            res.status(404).json(err);
        });
});

// Scrape
router.get("/scraper", (req, res) => {
    axios
        .get("https://www.huffingtonpost.com/section/green")
        .then((ax) => {
            const $ = cheerio.load(ax.data),
                cards = $(".a-page__column--center .card"),
                cardsArr = [];
            cards.each(function(i) {
                const cardContent = $(this).find(".card__content"),
                    headlines = cardContent.find(".card__headlines"),
                    article = {
                        headline: $(this).find(".card__label__text").text(),
                        summary: headlines.find(".card__headline__text").text().trim(),
                        url: `https://www.huffingtonpost.com${cardContent.find(".card__link").attr("href")}`,
                        src: cardContent.find(".card__image img").attr("src")
                    };
                if (article.headline) cardsArr.push(article);
            });
            db.Article
                .insertMany(cardsArr)
                .then(() => {
                    res.redirect(303, "/articles");
                })
                .catch((err) => {
                    res.status(500).json(err);
                });
        })
        .catch((err) => {
            res.status(404).json(err);
        });
});

// Get comment
router.get("/comments/:id", (req, res) => {
    const {id} = req.params;
    db.Article
        .findOne({_id: id})
        .then((article) => {
            return db.Comment
                .find({_id: article.comment});
        })
        .then((comments) => {
            res.status(200).json(comments);
        })
        .catch((err) => {
            res.send(500).json(err);
        });
});

// Create comment
router.post("/comments", (req, res) => {
    const {id, title, body} = req.body;
    db.Comment
        .create({title, body})
        .then((comment) => {
            return db.Article.findOneAndUpdate({_id: id}, {comment: comment._id}, {new: true});
        })
        .then((article) => {
            res.status(200).json(article);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// Update comment
router.put("/comments/:id", (req, res) => {
    const {id, body} = req.body;
    db.Comment
        .findOneAndUpdate({_id: id}, {body})
        .then((comment) => {
            res.status(200).json(comment);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// Delete comment
router.delete("/comments/:id", (req, res) => {
    const {id} = req.params;
    db.Comment
        .findByIdAndDelete(id)
        .then((comment) => {
            console.log("Deleted comment:", comment.body);
            res.status(200).json(comment);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// Clear scraped data
router.delete("/clear", (req, res) => {
    db.Article
        .remove({})
        .then(() => {
            return db.Comment.remove({});
        })
        .then(() => {
            res.redirect(303, "/articles");
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// Export -------------------- //
 
module.exports = router;
