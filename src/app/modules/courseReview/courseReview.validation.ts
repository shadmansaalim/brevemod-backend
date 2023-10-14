// Imports
import { z } from "zod";

const create = z.object({
  body: z.object({
    rating: z.number({
      required_error: "Rating is required",
    }),
    words: z.string({
      required_error: "Words are required",
    }),
  }),
});

export const CourseReviewValidation = {
  create,
};
