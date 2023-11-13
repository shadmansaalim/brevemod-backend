"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleValidation = void 0;
// Imports
const zod_1 = require("zod");
const createCourseModule = zod_1.z.object({
    body: zod_1.z.object({
        courseId: zod_1.z.string({
            required_error: "CourseId is required",
        }),
        moduleName: zod_1.z.string({
            required_error: "Module Name is required",
        }),
    }),
});
const updateCourseModule = zod_1.z.object({
    body: zod_1.z.object({
        moduleName: zod_1.z.string({
            required_error: "Module Name is required",
        }),
    }),
});
const addContentToCourseModule = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Content title is required",
        }),
        type: zod_1.z.string({
            required_error: "Content type is required",
        }),
        link: zod_1.z.string({
            required_error: "Content link is required",
        }),
        duration: zod_1.z.number().optional(),
    }),
});
const updateContentInCourseModule = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        type: zod_1.z.string().optional(),
        link: zod_1.z.string().optional(),
        duration: zod_1.z.number().optional(),
    }),
});
exports.CourseModuleValidation = {
    createCourseModule,
    updateCourseModule,
    addContentToCourseModule,
    updateContentInCourseModule,
};
