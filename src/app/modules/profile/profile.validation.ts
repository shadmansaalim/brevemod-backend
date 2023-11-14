// Imports
import { z } from "zod";

const update = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(4, "First Name must have at least 4 characters")
      .optional(),
    middleName: z.string().optional(),
    lastName: z
      .string()
      .min(4, "Last Name must have at least 4 characters")
      .optional(),
  }),
});

export const ProfileValidation = {
  update,
};
