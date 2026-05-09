"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
// Imports
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true,
    },
    courses: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Course",
            default: [],
        },
    ],
    payment: {
        subTotal: {
            type: Number,
            default: 0.0,
            set: (value) => parseFloat(value.toFixed(2)),
        },
        tax: {
            type: Number,
            default: 0.0,
            set: (value) => parseFloat(value.toFixed(2)),
        },
        grandTotal: {
            type: Number,
            default: 0.0,
            set: (value) => parseFloat(value.toFixed(2)),
        },
    },
}, {
    timestamps: true,
});
exports.Cart = (0, mongoose_1.model)("Cart", cartSchema);
