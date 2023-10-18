// Imports
import { z } from "zod";
import { ENUM_USER_ROLES } from "../../../enums/users";

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
  update,
};
