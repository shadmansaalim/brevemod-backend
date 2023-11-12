// Imports
import { z } from "zod";

const createCourseModule = z.object({
  body: z.object({
    courseId: z.string({
      required_error: "CourseId is required",
    }),
    moduleName: z.string({
      required_error: "Module Name is required",
    }),
  }),
});

const updateCourseModule = z.object({
  body: z.object({
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

const updateContentInCourseModule = z.object({
  body: z.object({
    title: z.string().optional(),
    type: z.string().optional(),
    link: z.string().optional(),
    duration: z.number().optional(),
  }),
});

export const CourseModuleValidation = {
  createCourseModule,
  updateCourseModule,
  addContentToCourseModule,
  updateContentInCourseModule,
};
