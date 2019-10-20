//---------------- DEPENDENCIES --------------------
var cheerio = require("cheerio");
var axios = require("axios");

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing headline, link and summary\n" +
            "from Guardian's entertainment news:" +
            "\n***********************************\n");


// Making a request via axios for The Guardian's entertainment HTML page
axios.get("https://www.huffpost.com/entertainment/").then(function(response) {

  var $ = cheerio.load(response.data);

  var headlineEl = $("h2.card__headline__text");
  var linkEl = $("a.card__headline--long");
  var summaryEl = $("div.card__description");
  var imageEl = $("img.img-sized__img");

  // An empty array to save the data that we'll scrape
  var worldNewsResults = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("div.card").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var headline = $(element).find(headlineEl).text();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).find(linkEl).attr("href");
    var image = $(element).find(imageEl).attr("src");
    var summary = $(element).find(summaryEl).text();

    // Save these results in an object that we'll push into the results array we defined earlier
    worldNewsResults.push({
      headline: headline,
      link: link,
      image: image,
      summary: summary
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(worldNewsResults);
});
