"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileValidation = void 0;
// Imports
const zod_1 = require("zod");
const update = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(4, "First Name must have at least 4 characters"),
        middleName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().min(4, "Last Name must have at least 4 characters"),
    }),
});
exports.ProfileValidation = {
    update,
};
