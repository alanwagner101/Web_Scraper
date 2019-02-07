var scrape = $("#scrape");
var deleteButton = $("#delete");
var saveButton;
var removeButton;
var noteButton;
var noteDelete
var noteSave = $("#noteSave");
var articleArea = $("#articleArea");
var savedArticleArea = $("#savedArticleArea");
var noteArea = $("#noteArea")
var xButton = $("#xButton");

var articleAPI = {
    getArticles: function () {
        return $.ajax({
            url: "/articles",
            type: "GET"
        });
    },
    getSavedArticles: function () {
        return $.ajax({
            url: "/saved/true",
            type: "GET"
        });
    },
    deleteArticles: function () {
        return $.ajax({
            url: "/articles",
            type: "DELETE"
        });
    },
    updateArticle: function (id, data) {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            url: "/articles/" + id,
            type: "PUT",
            data: JSON.stringify(data)
        });
    },
    addNote: function (id, data) {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            url: "/articles/" + id,
            type: "POST",
            data: JSON.stringify(data)
        });
    },
    getNotes: function (id) {
        return $.ajax({
            method: "GET",
            url: "/articles/" + id
        });
    },
    deleteNotes: function (body) {
        return $.ajax({
            type: "DELETE",
            url: "/notes",
            data: body
        });
    }
};

var scrapeAPI = {
    getScrape: function () {
        return $.ajax({
            url: "/scrape",
            type: "GET"
        });
    },
};

console.log("hello")

var articles;
var images;

var Start = function () {
    articleAPI.getArticles({}).then(function (results) {

        articleArea.empty();

        results.forEach(element => {

            articles = $("<div class='card articles'>");
            articles.html("<div class='card-header'>" +
                "<a href='" + element.link + "'><h3>" + element.title + "</h3></a></div><div class='card-body'>" +
                "<div class='container'><div class='row'>" +
                "<div class='col-xl-6'><p>" + element.body + "</p><div class='row'><div class='col-md-12'>" +
                "<button class='btn btn-default btn-md saveButton' value='" + element._id + "'>Save this article</button></div></div>" +
                "</div><div class='col-xl-6'><img style='width: 100%;' src ='" + element.img + "'></div></div></div></div>");

            articleArea.prepend(articles);

        });
        saveButton = $(".saveButton");

        saveButton.on("click", function (event) {
            event.preventDefault();

            console.log($(this).val());

            articleAPI.updateArticle($(this).val(), { saved: true }).then(function () {
                console.log("Update Complete");
            });
        });
    });
};

Start();

scrape.on("click", function (event) {
    event.preventDefault();

    scrapeAPI.getScrape({}).then(function (response) {
        Start();
    });
});

deleteButton.on("click", function (event) {
    event.preventDefault();

    articleArea.empty();

    articleAPI.deleteArticles({}).then(function (response) {
        window.location.reload();
        Start();
    });
});

var savedArticles;

var savedStart = function () {
    articleAPI.getSavedArticles().then(function (results) {

        var run = function () {

            savedArticleArea.empty();

            results.forEach(element => {

                savedArticles = $("<div class='card articles'>");
                savedArticles.html("<div class='card-header'>" +
                    "<a href='" + element.link + "'><h3>" + element.title + "</h3></a></div><div class='card-body'>" +
                    "<div class='container'><div class='row'>" +
                    "<div class='col-xl-6'><p>" + element.body + "</p><div class='row'><div class='col-md-12'>" +
                    "<button class='btn btn-default btn-md removeButton' value='" + element._id + "'>Remove from saved articles</button>" +
                    "<button class='btn btn-default btn-md noteButton'  data-toggle='modal' data-target='#Modal' value='" + element._id + "'>Add a note</button>" +
                    "</div></div></div><div class='col-xl-6'><img style='width: 100%;' src ='" + element.img + "'></div></div></div></div>");

                savedArticleArea.prepend(savedArticles);
            });
        };

        run();

        removeButton = $(".removeButton");

        removeButton.on("click", function (event) {
            event.preventDefault();

            console.log($(this).val());

            articleAPI.updateArticle($(this).val(), { saved: false }).then(function () {
                console.log("Update Complete");
                run();
            });
        });

        noteButton = $(".noteButton");

        var modalLabel = $("#ModalLabel");

        var note;

        noteButton.on("click", function (event) {
            event.preventDefault();

            modalLabel.empty();
            noteArea.empty();

            modalLabel.text("Note For Article: " + noteButton.val());

            articleAPI.getNotes($(this).val()).then(function (results) {
                console.log(results);

                for (var i = 0; i < results.note.length; i++) {
                    if (results.note[i] === "") {
                        console.log(" blank ");
                    } else {
                        noteArea.append("<h6 style='float: left;'>" + results.note[i] +
                            "</h6><button type='button' class='btn btn-danger btn-lrg noteDelete'" + 
                            " style='float: right;' data-dismiss='modal'" + 
                            " aria-label='Close'>X</button><br><br>");
                    };
                };

                noteDelete = $(".noteDelete");

                // noteDelete.on("click", function (event) {
                //     event.preventDefault();
    
                //   var deleteWords = {body: $(this).parent("div").children("h6").text().replace("'", "")}
    
                //     articleAPI.deleteNotes(deleteWords).then(function() {
                //         console.log("delete successfull");
        
                //     });
                // });
            });

            noteSave.on("click", function (event) {
                event.preventDefault();

                note = $("#note").val();

                articleAPI.addNote(noteButton.val(), { body: note }).then(function () {
                    console.log("added note");
                });

                $("#note").val("");


            });

            xButton.on("click", function(event) {
                event.preventDefault();

            });
        });
    });
};

savedStart();