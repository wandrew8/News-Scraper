// ==============================================================================
// DEPENDENCIES
// ==============================================================================

// var path = require("path");
// var db = require("../models");

// ================================================================================
//  ROUTES
// ================================================================================

module.exports = function(app) {

    // Each of these routes handles the HTML page that the user gets sent to.
    
    app.get("/", function(req, res) {
      res.render("home")
    })

    app.get("/saved", function(req, res) {
        res.render("saved")
    })

    app.get("/search", function(req, res) {
        res.render("search")
    })
    
}