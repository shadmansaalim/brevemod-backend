"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModule = void 0;
// Imports
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const moduleContentSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: () => new mongoose_2.Types.ObjectId(),
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
    },
});
const courseModuleSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    moduleNumber: {
        type: Number,
        required: true,
    },
    moduleName: {
        type: String,
        required: true,
    },
    moduleContents: {
        type: [moduleContentSchema],
        default: [],
    },
}, {
    timestamps: true,
});
exports.CourseModule = (0, mongoose_1.model)("CourseModule", courseModuleSchema);
