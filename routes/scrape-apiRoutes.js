var cheerio = require("cheerio");
var axios = require("axios");
var db = require("../models");

module.exports = function (app) {

    app.get("/scrape", function (req, res) {

        var articleArr = [];
        var resultArr = [];

        db.Article.find({})
            .then(function (dbArticle) {
                for (var i = 0; i < dbArticle.length; i++) {
                    articleArr.push(dbArticle[i]);
                }
            })
            .catch(function (err) {
                console.log(err);
            });

        axios.get("https://www.npr.org/").then(function (response) {
            var $ = cheerio.load(response.data);

            $("article h3").each(function (i, element) {
                var result = {};

                result.title = $(this)
                    .text();
                result.body = $(this)
                    .parent("a")
                    .parent("div")
                    .children("a")
                    .children("p")
                    .text();
                result.img = $(this)
                    .parent("a")
                    .parent("div")
                    .parent("div")
                    .children("figure")
                    .children("div")
                    .children("div")
                    .children("a")
                    .children("img")
                    .attr("src");
                result.link = $(this)
                    .parent("a")
                    .attr("href");

                console.log(result.title);
                console.log(result.body);
                console.log(result.img);
                console.log(result.link);

                resultArr.push(result);
            });


            for (var i = 0; i < resultArr.length; i++) {
                for (var j = 0; j < articleArr.length; j++) {
                    if (resultArr[i].title == articleArr[j].title) {
                        resultArr.splice(i, 1);
                    }
                }
            }

            console.log(resultArr);

            for (var k = 0; k < resultArr.length; k++) {
                db.Article.create(resultArr[k])
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }

            res.send("Scrape Complete");
        })
        .catch(function(err) {
            console.log(err);
        });
    });
}