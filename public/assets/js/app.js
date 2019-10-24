$(document).ready(function () {

    //Scrapes articles when search button is clicked
    $("#scrape").on("click", function () {
        // $('#list-container').empty();

        $.ajax({
            method: "GET",
            url: "/scrape",
        }).done(function (data) {
            console.log(data)
            window.location = "/"
        })
    });

    // Marks article as saved: true when the button is clicked
    $(".save-article").on("click", function () {
        var savedId = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/articles/saved/" + savedId,
            data: {
                id: $(this).attr('data-id'),
                saved: true
            }
        }).done(function (data) {
            console.log(data)
            window.location = "/"
        })
    });


    // Article saved modal on click commands
    $(".save-article-button").on("click", function () {
        console.log("Button clicked")
        $("#article-saved").css("display", "flex");
    })

    $("button.close-modal").on("click", function (event) {
        event.preventDefault();
        $("#article-saved").css("display", "none");

    })

    // Delete an article from saved articles page

    $(".delete-article").on("click", function () {
        $(this).parent().css("display", "none");
        let savedId = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/articles/delete/" + savedId,
            data: {
                id: $(this).attr('data-id'),
                saved: false
            }
        }).done(function (data) {
            console.log(data)
            window.location = "/saved"
        })


    });

    // Add comment modal on click commands

    $(".add-comment-button").on("click", function () {
        $("#add-comment-form").css("display", "flex");
    });

    $("button.close-modal").on("click", function (event) {
        event.preventDefault();
        $("#add-comment-form").css("display", "none");

    });

    // View comments modal on click commands

    $(".view-comments-button").on("click", function () {
        $("#view-comments-modal").css("display", "flex");
    })

    $("button.close-modal").on("click", function (event) {
        event.preventDefault();
        $("#view-comments-modal").css("display", "none");

    });

    // $("#add-comment").on("click", function () {
    //     var thisId = $(this).attr("data-article-id");
    //     $.ajax({
    //         method: "POST",
    //         url: "comments/saved/" + thisId,
    //         data: {
    //             body: $("#add-comment-text-submit").val(),
    //         }
    //     }).done(function (data) {
    //         console.log(data)
    //         $("#add-comment-text-submit" + thisId).val("");
    //         window.location = "/saved"

    //     });
    // });

    $("#add-comment").on("click", function () {
        let body = $("#note-body").val().trim();
        let id = $(this).attr("data-article-id");

          const data = { body: body };
    
         $.ajax({
            method: "POST",
            url: "/comments/saved/" + id,
            data: data
        }).done(function (data) {
            console.log(data)
            // $("#add-comment-text-submit" + id).val("");
            window.location = "/saved"

        });
    })



    $("span.delete-comment").on("click", function () {

        var noteId = $(this).attr("data-note-id");
        var articleId = $(this).attr("data-article-id");
        $.ajax({
            method: "DELETE",
            url: "/notes/delete/" + noteId + "/" + articleId
        }).done(function (data) {
            console.log(data)
            window.location = "/saved"
        })
    })


});