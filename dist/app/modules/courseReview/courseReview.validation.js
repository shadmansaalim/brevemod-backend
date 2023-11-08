"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseReviewValidation = void 0;
// Imports
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number({
            required_error: "Rating is required",
        }),
        words: zod_1.z.string({
            required_error: "Words are required",
        }),
    }),
});
exports.CourseReviewValidation = {
    create,
};
