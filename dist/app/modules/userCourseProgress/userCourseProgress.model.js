"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCourseProgress = void 0;
// Imports
const mongoose_1 = require("mongoose");
const userCourseProgressSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    completed: {
        type: [
            {
                moduleId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: "CourseModule",
                    required: true,
                },
                moduleNumber: {
                    type: Number,
                    required: true,
                },
                contentId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    required: true,
                },
            },
        ],
        default: [],
    },
    current: {
        moduleId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "CourseModule",
            required: true,
        },
        moduleNumber: {
            type: Number,
            required: true,
        },
        contentId: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
        },
    },
    completedContentCount: {
        type: Number,
        default: 0,
    },
    percentage: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
exports.UserCourseProgress = (0, mongoose_1.model)("UserCourseProgress", userCourseProgressSchema);
