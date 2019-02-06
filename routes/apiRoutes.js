var db = require("../models")

module.exports = function(app) {

    app.get("/articles", function(req, res) {
        db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
    });
    
    app.get("/articles/:id", function(req, res) {
        db.Article.findOne({ _id: req.params.id })
        .populate("Note")
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    app.get("/saved/:saved", function(req, res) {
        db.Article.find({ saved: req.params.saved }).then(function(dbArticle) {
            res.json(dbArticle);
        })
    })
    
    app.post("/articles/:id", function(req, res) {
        db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    app.delete("/articles", function(req, res) {
        db.Article.remove({})
        .then(function() {
            console.log("Articles have been successfully deleted");
        })
    })

    app.put("/articles/:id", function(req, res) {
        db.Article.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .then(function() {
            console.log("Update complete");
        })
        .catch(function(err) {
            res.json(err);
        });
    });
};