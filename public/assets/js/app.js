/**
 * Application Logic
 */

// Global Variables -------------------- //

const clearButton = $("#clear"),
    commentButton = $(".comment"),
    viewButton = $(".view"),
    viewCommentModal = $("#view-comment-modal"),
    commentModal = $("#comment-modal"),
    makeCommentButton = $("#make-comment"),
    modalFooter = $(".modal-footer");

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
        commentModal.find(".modal-title span").text(articleTitle);
        commentModal.find(".modal-body").data("id", articleId);
        commentModal.find(".modal-body").data("title", articleTitle);
        commentModal.find(".modal-footer").show();
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
            console.log(err.statusText);
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
                .find(".modal-title span")
                .text($(this)
                    .closest(".card-body")
                    .find(".summary")
                    .text());
            if (comment) {
                modalBody.find(".comment").text(comment.body);
                modalBody.data("id", comment._id);
                modalFooter.show();
            } else {
                modalBody.find(".comment").text("No Comment Yet");
                modalFooter.find("#go-make-comment").show();
                modalFooter.hide();
            }
            viewCommentModal.modal("show");
        }, (err) => {
            console.log(err.statusText);
        });
    });

    // Modal edit button on click
    modalFooter.on("click", ".edit", function() {
        const modalBody = $(this).closest(".modal-content").find(".modal-body"),
            text = modalBody.find(".comment").text();
        modalBody.data("body", modalBody.html());
        modalBody.find("p").remove();
        modalBody.prepend(`
            <input class="form-control" type="text" name="comment" value="${text}" placeholder="Enter required" />
        `);
        $(this).removeClass("edit");
        $(this).addClass("save");
        $(this).text("Save");
    });

    // Modal delete button on click
    modalFooter.on("click", ".delete", function() {
        const modalBody = $(this).closest(".modal-content").find(".modal-body"),
            id = modalBody.data("id");
        viewCommentModal.modal("hide");
        $.ajax({
            url: `/comments/${id}`,
            method: "DELETE"
        })
        .then(() => {
            location.reload();
        }, (err) => {
            console.log(err.statusText);
        });
    });

    // Modal save button on click
    modalFooter.on("click", ".save", function() {
        const modalBody = $(this).closest(".modal-content").find(".modal-body"),
            comment = {
                id: modalBody.data("id"),
                body: modalBody.find("input").val()
            };
        viewCommentModal.modal("hide");
        $.ajax({
            url: `/comments/${modalBody.data("id")}`,
            method: "PUT",
            data: comment
        })
        .then(() => {
            location.reload();
        }, (err) => {
            console.log(err.statusText);
        });
    });

    // When view comment modal is closed, make sure input fields are open
    viewCommentModal.on("hidden.bs.modal", function() {
        const modalBody = $(this).find(".modal-body"),
            modalFooter = $(this).find(".modal-footer");
        try {
            const bodyPara = modalBody.data("body").trim();
            if (!$(this).find('.modal-body p').html()) {
                const leadButton = modalFooter.find(".save");
                leadButton
                    .removeClass("save")
                    .addClass("edit")
                    .text("Edit");
                modalBody.html(bodyPara);
            }
        } catch (err) {}
    });
});
