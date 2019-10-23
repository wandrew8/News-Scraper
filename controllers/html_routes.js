// ==============================================================================
// DEPENDENCIES
// ==============================================================================

var path = require("path");
var db = require("../models");

// ================================================================================
//  ROUTES
// ================================================================================

module.exports = function(app) {

    // Each of these routes handles the HTML page that the user gets sent to.
    
    app.get("/", (req, res) => {
        const data = {};
        data.page = "/";
        db.Article.find()
        .then(article => {
            data.article = article;
            res.render("home", data)
        })
        .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
        });
    })

    app.get('/saved', (req, res) => {
        const data = {};
        data.page = '/saved';
        db.Article.find({saved: true})
            // grabs all saved articles based on the articleId in the savedArticles array saved to the user document
            .then(result => {
                let hbsobj = {article: result}
              res.render('saved', hbsobj);
            })
            .catch(() => res.send('An error occured while loading saved articles'));
      
          // this will render a 403 page if the user is not authenticated
        
      });

      


};