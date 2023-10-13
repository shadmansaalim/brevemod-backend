// Imports
import { Schema, model } from "mongoose";
import { CourseModel, ICourse } from "./course.interface";

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    avgRating: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
      default: 0.0,
    },
    thumbnailLink: {
      type: String,
      required: true,
    },
    introVideoLink: {
      type: String,
      required: true,
    },
    lecturesCount: {
      type: Number,
      required: true,
    },
    projectsCount: {
      type: Number,
      required: true,
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Course = model<ICourse, CourseModel>("Course", courseSchema);
