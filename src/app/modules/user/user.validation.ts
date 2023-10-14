// Imports
import { z } from "zod";

const update = z.object({
  body: z.object({
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
  }),
});

export const UserValidation = {
  update,
};
