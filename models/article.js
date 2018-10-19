/**
 * Article Mongoose Model
 */

// Dependencies ----------/

const mongoose = require("mongoose");

// Schema ----------/

const {Schema} = mongoose,
ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

// Model --------------------/

const Article = mongoose.model("Article", ArticleSchema);

// Export Model --------------------/

module.exports = Article;
