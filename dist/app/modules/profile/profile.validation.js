"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileValidation = void 0;
// Imports
const zod_1 = require("zod");
const update = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().optional(),
        middleName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
    }),
});
exports.ProfileValidation = {
    update,
};
