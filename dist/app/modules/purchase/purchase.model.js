"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchase = void 0;
// Imports
const mongoose_1 = require("mongoose");
const purchaseSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
exports.Purchase = (0, mongoose_1.model)("Purchase", purchaseSchema);
