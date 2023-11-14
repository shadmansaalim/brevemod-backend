// Imports
import { z } from "zod";

const update = z.object({
  body: z.object({
    firstName: z.string().min(4, "First Name must have at least 4 characters"),
    middleName: z.string().optional(),
    lastName: z.string().min(4, "Last Name must have at least 4 characters"),
  }),
});

export const ProfileValidation = {
  update,
};
