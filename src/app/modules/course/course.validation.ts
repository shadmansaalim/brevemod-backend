// Imports
import { z } from "zod";

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    instructorName: z.string({
      required_error: "Instructor Name is required",
    }),
    price: z.number({
      required_error: "Price is required",
    }),
    thumbnailLink: z.string({
      required_error: "Thumbnail Link is required",
    }),
    introVideoLink: z.string({
      required_error: "Intro Video Link is required",
    }),
    lecturesCount: z.number({
      required_error: "Lectures count is required",
    }),
    projectsCount: z.number({
      required_error: "Project count is required",
    }),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    instructorName: z.string().optional(),
    price: z.number().optional(),
    thumbnailLink: z.string().optional(),
    introVideoLink: z.string().optional(),
    lecturesCount: z.number().optional(),
    projectsCount: z.number().optional(),
  }),
});

export const CourseValidation = {
  create,
  update,
};
