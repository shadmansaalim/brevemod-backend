// Imports
import { z } from "zod";

const createCourseModule = z.object({
  body: z.object({
    courseId: z.string({
      required_error: "CourseId is required",
    }),
    moduleNumber: z.string({
      required_error: "Module number is required",
    }),
    moduleName: z.string({
      required_error: "Module Name is required",
    }),
  }),
});

const addContentToCourseModule = z.object({
  body: z.object({
    title: z.string({
      required_error: "Content title is required",
    }),
    type: z.string({
      required_error: "Content type is required",
    }),
    link: z.string({
      required_error: "Content link is required",
    }),
    duration: z.number().optional(),
  }),
});

export const CourseModuleValidation = {
  createCourseModule,
  addContentToCourseModule,
};
