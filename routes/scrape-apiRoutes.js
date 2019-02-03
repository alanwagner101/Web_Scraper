var cheerio = require("cheerio");
var axios = require("axios");
var db = require("../models");

module.exports = function(app) {

    app.get("/scrape", function(req, res) {

        axios.get("https://www.npr.org/").then(function(response) {
        var $ = cheerio.load(response.data);
    
        $("article h3").each(function(i, element) {
            var result = {};
    
            result.title = $(this)
            // .children("a")
            .text();
            // result.link = $(this)
            // .children("a")
            // .attr("href");

            console.log(result.title);
    
            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });
    
        res.send("Scrape Complete");
        });
    });
}