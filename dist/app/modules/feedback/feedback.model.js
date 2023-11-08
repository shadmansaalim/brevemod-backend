"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
// Imports
const mongoose_1 = require("mongoose");
const feedbackSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
exports.Feedback = (0, mongoose_1.model)("Feedback", feedbackSchema);
