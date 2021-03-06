var axios = require("axios");
var express = require("express");
var router = express.Router();
var cheerio = require("cheerio");
var db = require("../models");


// Create all our routes and set up logic within those routes where required.
router.get("/", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            var hbsObject = {
                articles: dbArticle
            };
            console.log(hbsObject);
            res.render("index", hbsObject);
        });
});

// A GET route for scraping the echoJS website
router.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com").then(function (response) {
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("h2")
                .children("a")
                .text();
            result.link = $(this)
                .children("h2")
                .children("a")
                .attr("href");
            result.summary = $(this)
                .children("p")
                .attr("class", "summary")
                .text();

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });
        // If we were able to successfully scrape and save an Article, send a message to the client
        res.redirect(307, "/");
    });
});

// Route to see what saved articles looks like WITH populating
router.get("/saved", function (req, res) {
    // Using our Library model, "find" every library in our db and populate them with any associated books
    db.SavedArticle.findOne({})
        // Specify that we want to populate the retrieved SavedArticle with any associated articles
        .populate("articles")
        .then(function (dbSavedArticle) {
            console.log("dbSavedArticle");
            // If any SavedArticle are found, send them to the client with any associated articles
            // res.json(dbSavedArticle);
            var hbsObject = {
                articles: dbSavedArticle.articles
            };
            if(hbsObject)
                {res.render("saved", hbsObject)}
            else{res.render("saved", {articles: []})}
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({
            _id: req.params.id
        })
        // ..and populate all of the notes associated with it
        .populate("notes")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.post("/articles/note/:id", function (req, res) {
    console.log("post");
    console.log(req.body);
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                $push: {
                    notes: dbNote._id
                }
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// POST route for saving a article
router.post("/articles/save/:id", function (req, res) {
    // Create a new Book in the database
    db.SavedArticle.findOneAndUpdate({}, {
            $push: {
                articles: req.params.id
            }
        }, {
            new: true
        }).then(function (dbArticle) {
            // If the Library was updated successfully, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});

// delete note
router.post("/articles/note/clear/:id", function (req, res) {
    // Remove every note from the notes collection
    db.Note.remove({
        _id: req.params.id
    }, function (error, response) {
        // Log any errors to the console
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            // Otherwise, send the mongojs response to the browser
            // This will fire off the success function of the ajax request
            console.log(response);
            res.send(response);
        }
    });
});

// Export routes for server.js to use.
module.exports = router;