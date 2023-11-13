"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCourseRating = void 0;
// Imports
const mongoose_1 = require("mongoose");
const userCourseRatingSchema = new mongoose_1.Schema({
    courseId: {
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
        set: (value) => value.toFixed(1),
    },
}, {
    timestamps: true,
});
exports.UserCourseRating = (0, mongoose_1.model)("UserCourseRating", userCourseRatingSchema);
