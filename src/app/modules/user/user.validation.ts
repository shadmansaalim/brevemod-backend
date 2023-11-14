// Imports
import { z } from "zod";
import { ENUM_USER_ROLES } from "../../../enums/users";

const create = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: "First Name is required",
      })
      .min(4, "First Name must have at least 4 characters"),
    middleName: z.string().optional(),
    lastName: z
      .string({
        required_error: "Last Name is required",
      })
      .min(4, "Last Name must have at least 4 characters"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
    role: z.enum(Object.values(ENUM_USER_ROLES) as [string, ...string[]], {
      required_error: "Role is required",
    }),
  }),
});

const update = z.object({
  body: z.object({
    firstName: z.string().min(4, "First Name must have at least 4 characters"),
    middleName: z.string().optional(),
    lastName: z.string().min(4, "Last Name must have at least 4 characters"),
    role: z
      .enum(Object.values(ENUM_USER_ROLES) as [string, ...string[]])
      .optional(),
  }),
});

export const UserValidation = {
  create,
  update,
};
