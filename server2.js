// ==============================================================================
// DEPENDENCIES
// ==============================================================================

var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var exphbs = require("express-handlebars");

// ==============================================================================
// EXPRESS CONFIGURATION
// ==============================================================================

var app = express();

var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==============================================================================
// SERVES STATIC CONTENT
// ==============================================================================

app.use(express.static('public'));

// ==============================================================================
// HANDLEBARS CONFIGURATION
// ==============================================================================

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ================================================================================
//  ROUTES
// ================================================================================

require("./controllers/html_routes.js")(app);


axios.get("https://www.nytimes.com/spotlight/travel-tips").then(function (response) {

    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var travelTipsResults = [];

    var headlineEL = $(".headline a");
    var linkEL = $("figure.media a");
    var imageEL = $("figure.media img");
    var summaryEL = $("div.story-body p.summary");
    var authorEL = $("p.byline span.author");

    $("section.highlights-collection-package li").each(function (i, element) {

        var headline = $(element).find(headlineEL).text();
        var link = $(element).find(linkEL).attr("href");
        var image = $(element).find(imageEL).attr("src");
        var summary = $(element).find(summaryEL).text();
        var author = $(element).find(authorEL).text();


        // Save these results in an object that we'll push into the results array we defined earlier
        travelTipsResults.push({
            headline: headline,
            author: author,
            summary: summary,
            link: link,
            image: image
        });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(travelTipsResults);
});

// =============================================================================
//  START EXPRESS APP
// =============================================================================

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});


