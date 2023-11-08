"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseReview = void 0;
// Imports
const mongoose_1 = require("mongoose");
const courseReviewSchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    words: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
exports.CourseReview = (0, mongoose_1.model)("CourseReview", courseReviewSchema);
