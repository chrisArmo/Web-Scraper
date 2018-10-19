/**
 * Application Logic
 */

// Global Variables -------------------- //

const clearButton = $("#clear"),
    commentButton = $(".comment"),
    viewButton = $(".view"),
    commentModal = $("#comment-modal"),
    makeCommentButton = $("#make-comment");

// Main -------------------- //

// After dom loads
$(document).ready(function(e) {
    // Clear articles on click
    clearButton.on("click", function(e) {
        $.ajax({
            url: "/clear",
            method: "DELETE"
        })
        .then(() => {
            location.reload();
        }, (err) => {
            console.log(err);
        });
    });
    
    // Open comment modal on click
    commentButton.on("click", function(e) {
        const articleId = $(this).closest(".row").data("id"),
            articleTitle = $(this).closest(".card-body").find(".summary").text();
        commentModal.find(".modal-title").find("span").text(articleTitle);
        commentModal.find(".modal-body").data("id", articleId);
        commentModal.find(".modal-body").data("title", articleTitle);
        commentModal.modal("show");
    });

    // Assemble comment object on make comment click
    makeCommentButton.on("click", function(e) {
        const modalBody = $(this).closest(".modal-content").find(".modal-body"),
            comment = {
                id: modalBody.data("id"),
                title: modalBody.data("title"),
                body: modalBody.find("#comment-add").val()
            };
        modalBody.data("id", "");

        modalBody.find("#comment-add").val("");
        modalBody.data("title", "");
        commentModal.modal("hide");
        $.ajax({
            url: "/comments",
            method: "POST",
            data: comment
        })
        .then(() => {
            location.reload();
        }, (err) => {
            console.log(err);
        });
    });

    // View article comments on view button click
    viewButton.on("click", function(e) {
        const articleId = $(this).closest(".row").data("id");
        $.ajax({
            url: `/comments/${articleId}`,
            method: "GET"
        })
        .then((comments) => {
            
        }, (err) => {
            console.log(err);
        });
    });
});
