/**
 * Comment Mongoose Model
 */

// Dependencies --------------------/

const mongoose = require("mongoose");

// Schema --------------------/

const {Schema} = mongoose,
CommentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

// Model --------------------/

const Comment = mongoose.model("Comment", CommentSchema);

// Export Model --------------------/

module.exports = Comment;
