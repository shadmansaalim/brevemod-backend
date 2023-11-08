"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
// Imports
const zod_1 = require("zod");
const users_1 = require("../../../enums/users");
const create = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({
            required_error: "First Name is required",
        }),
        middleName: zod_1.z.string().optional(),
        lastName: zod_1.z.string({
            required_error: "Last Name is required",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email(),
        role: zod_1.z.enum(Object.values(users_1.ENUM_USER_ROLES), {
            required_error: "Role is required",
        }),
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().optional(),
        middleName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        role: zod_1.z
            .enum(Object.values(users_1.ENUM_USER_ROLES))
            .optional(),
    }),
});
exports.UserValidation = {
    create,
    update,
};
