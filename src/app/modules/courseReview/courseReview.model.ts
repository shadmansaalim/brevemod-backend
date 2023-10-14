// Imports
import { Schema, model } from "mongoose";
import { CourseReviewModel, ICourseReview } from "./courseReview.interface";

const courseReviewSchema = new Schema<ICourseReview>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    words: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CourseReview = model<ICourseReview, CourseReviewModel>(
  "CourseReview",
  courseReviewSchema
);
