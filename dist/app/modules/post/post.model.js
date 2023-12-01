"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
// Imports
const mongoose_1 = require("mongoose");
const post_1 = require("../../../enums/post");
const postMediaSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["image", "video"],
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});
const postReactionSchema = new mongoose_1.Schema({
    react: {
        type: String,
        enum: Object.values(post_1.ENUM_POST_REACTIONS),
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
const postSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    // media: {
    //   type: postMediaSchema,
    //   default: null,
    // },
    authorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    published: {
        type: Boolean,
        default: true,
    },
    reactions: {
        type: [postReactionSchema],
        default: [],
    },
}, {
    timestamps: true,
});
exports.Post = (0, mongoose_1.model)("Post", postSchema);
