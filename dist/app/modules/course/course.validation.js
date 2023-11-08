"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidation = void 0;
// Imports
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        description: zod_1.z.string({
            required_error: "Description is required",
        }),
        instructorName: zod_1.z.string({
            required_error: "Instructor Name is required",
        }),
        price: zod_1.z.number({
            required_error: "Price is required",
        }),
        thumbnailLink: zod_1.z.string({
            required_error: "Thumbnail Link is required",
        }),
        introVideoLink: zod_1.z.string({
            required_error: "Intro Video Link is required",
        }),
        lecturesCount: zod_1.z.number({
            required_error: "Lectures count is required",
        }),
        projectsCount: zod_1.z.number({
            required_error: "Project count is required",
        }),
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        instructorName: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        thumbnailLink: zod_1.z.string().optional(),
        introVideoLink: zod_1.z.string().optional(),
        lecturesCount: zod_1.z.number().optional(),
        projectsCount: zod_1.z.number().optional(),
    }),
});
exports.CourseValidation = {
    create,
    update,
};
