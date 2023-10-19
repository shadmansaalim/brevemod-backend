// Imports
import { z } from "zod";
import { ENUM_USER_ROLES } from "../../../enums/users";

const create = z.object({
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
    role: z.enum(Object.values(ENUM_USER_ROLES) as [string, ...string[]], {
      required_error: "Role is required",
    }),
  }),
});

const update = z.object({
  body: z.object({
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    role: z
      .enum(Object.values(ENUM_USER_ROLES) as [string, ...string[]])
      .optional(),
  }),
});

export const UserValidation = {
  create,
  update,
};
