// ==============================================================================
// DEPENDENCIES
// ==============================================================================

var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");
var db = require("./models");

// ==============================================================================
// EXPRESS AND MIDDLEWARE CONFIGURATION
// ==============================================================================

var app = express();

var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger("dev"));

// ==============================================================================
// SERVES STATIC CONTENT
// ==============================================================================

app.use(express.static('public'));

// ==============================================================================
// HANDLEBARS CONFIGURATION
// ==============================================================================

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ==============================================================================
// MONGO DB CONFIGURATION
// ==============================================================================

mongoose.connect("mongodb://localhost/articlesdb", { useNewUrlParser: true });

// ================================================================================
//  ROUTES
// ================================================================================

require("./controllers/html_routes.js")(app);

app.get("/", function (req, res) {
    db.Article.find({"saved": false}).limit(9)
    .then(function (data) {
        var hbsObject = {
            article: data
        };
        console.log(hbsObject);
        res.render("home", hbsObject);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/saved", function (req, res) {
    db.Article.find({ "saved": true }).populate("comment")
    .then(function (error, articles) {
        var hbsObject = {
            article: articles
        };
        res.render("saved", hbsObject);
    });
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/spotlight/travel-tips").then(function (response) {

        var $ = cheerio.load(response.data);

        var headlineEL = $(".headline a");
        var linkEL = $("figure.media a");
        var imageEL = $("figure.media img");
        var summaryEL = $("div.story-body p.summary");
        var authorEL = $("p.byline span.author");

        $("section.highlights-collection-package li").each(function (i, element) {

            var result = {};

            result.headline = $(element).find(headlineEL).text();
            result.link = $(element).find(linkEL).attr("href");
            result.image = $(element).find(imageEL).attr("src");
            result.summary = $(element).find(summaryEL).text();
            result.author = $(element).find(authorEL).text();


            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        res.send("Scrape Complete")
    });

});



app.get("/articles", function (req, res) {
    db.Article.find({}).limit(9)
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ "_id": req.params.id })
        .populate("comment")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.post("/articles/saved/:id", function (req, res) {
    // db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
    db.Article.update({"_id": req.params.id }, { "saved": true })
        .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
        });
});

app.post("/articles/delete/:id", function (req, res) {
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
        .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
        });
});

app.post("comments/saved/:id", function (req, res) {
    var newComment = new Comment({
        body: req.body.text,
        article: req.params.id
    });
    console.log(req.body)
    newComment.save(function (error, comment) {
        if (error) {
            console.log(error);
        }
        else {
            Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "comment": comment } })
                .exec(function (err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    else {
                        res.send(comment);
                    }
                });
        }
    });
});

app.delete("/notes/delete/:note_id/:article", function (req, res) {
    db.Comment.findOneAndRemove({ "_id": req.params.comment.id }, function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            Article.findOneAndUpdate({ "_id": req.params.article_id }, { $pull: { "nocommenttes": req.params.comment_id } })
                .exec(function (err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    else {
                        res.send("Comment Deleted");
                    }
                });
        }
    });
});

// =============================================================================
//  START EXPRESS APP
// =============================================================================

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});


