"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
// Imports
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructorName: {
        type: String,
        required: true,
    },
    totalRating: {
        type: Number,
        default: 0.0,
        set: (value) => parseFloat(value.toFixed(1)),
    },
    ratingCount: {
        type: Number,
        default: 0,
    },
    avgRating: {
        type: Number,
        default: 0.0,
        set: (value) => parseFloat(value.toFixed(1)),
    },
    price: {
        type: Number,
        required: true,
        default: 0.0,
    },
    thumbnailLink: {
        type: String,
        required: true,
    },
    introVideoLink: {
        type: String,
        required: true,
    },
    lecturesCount: {
        type: Number,
        required: true,
    },
    projectsCount: {
        type: Number,
        required: true,
    },
    studentsCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
exports.Course = (0, mongoose_1.model)("Course", courseSchema);
