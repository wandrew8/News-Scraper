$(document).ready(function () {

    //Scrapes articles when search button is clicked
    $("#scrape").on("click", function () {
        $('#list-container').empty();

        $.ajax({
            method: "GET",
            url: "/scrape",
        }).done(function (data) {
            console.log(data)
            window.location = "/"
        })
    });

    // Marks article as saved: true when the button is clicked
    $(".save-article").on("click", function() {
        var savedId = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/articles/saved/" + savedId,
            data: {
                id: $(this).attr('data-id')
            }.done(function(data) {
                window.location = "/"
            })
        })
    })

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
    })

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

});