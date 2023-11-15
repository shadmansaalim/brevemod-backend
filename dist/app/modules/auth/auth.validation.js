"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
// Imports
const zod_1 = require("zod");
// Validation of API request using ZOD
const signUpZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z
            .string({
            required_error: "First Name is required",
        })
            .min(4, "First Name must have at least 4 characters"),
        middleName: zod_1.z.string().optional(),
        lastName: zod_1.z
            .string({
            required_error: "Last Name is required",
        })
            .min(4, "Last Name must have at least 4 characters"),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email(),
        password: zod_1.z
            .string({
            required_error: "Password is required",
        })
            .min(6, "Password must have at least 6 characters"),
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required.",
        })
            .email(),
        password: zod_1.z
            .string({
            required_error: "Password is required.",
        })
            .min(6, "Password must have at least 6 characters"),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: "Id is required.",
        }),
    }),
});
const changePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z
            .string({
            required_error: "Old Password is required.",
        })
            .min(6, "Password must have at least 6 characters"),
        newPassword: zod_1.z
            .string({
            required_error: "New Password is required.",
        })
            .min(6, "Password must have at least 6 characters"),
    }),
});
exports.AuthValidation = {
    signUpZodSchema,
    loginZodSchema,
    refreshTokenZodSchema,
    changePasswordZodSchema,
};
