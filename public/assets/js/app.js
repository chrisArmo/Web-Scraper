/**
 * Application Logic
 */

// Global Variables -------------------- //

const clearButton = $("#clear"),
    commentButton = $(".comment"),
    viewButton = $(".view"),
    viewCommentModal = $("#view-comment-modal"),
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
        .then((commentArr) => {
            const [comment] = commentArr,
                modalBody = viewCommentModal.find(".modal-body");
            viewCommentModal
                .find(".modal-title")
                .find("span")
                .text($(this)
                    .closest(".card-body")
                    .find(".summary").text());
            if (comment.title && comment.body) {
                modalBody.find(".comment").text(comment.body);
                modalBody.data("id", comment._id);
                modalBody.find(".edit").show();
            } else {
                modalBody.find(".edit").hide();
                modalBody.find(".delete").hide();
            }
            viewCommentModal.modal("show");
        }, (err) => {
            console.log(err);
        });
    });
});
