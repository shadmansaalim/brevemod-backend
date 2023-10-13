// Imports
import { z } from "zod";

// Validation of API request using ZOD

const signUpZodSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: "First Name is required",
    }),
    middleName: z.string().optional(),
    lastName: z.string({
      required_error: "Last Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required.",
    }),
    password: z.string({
      required_error: "Password is required.",
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Id is required.",
    }),
  }),
});

const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old Password is required.",
    }),
    newPassword: z.string({
      required_error: "New Password is required.",
    }),
  }),
});

export const AuthValidation = {
  signUpZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema,
};
