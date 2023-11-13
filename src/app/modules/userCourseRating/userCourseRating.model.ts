// Imports
import { Schema, model } from "mongoose";
import {
  IUserCourseRating,
  UserCourseRatingModel,
} from "./userCourseRating.interface";

const userCourseRatingSchema = new Schema<IUserCourseRating>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      set: (value: number) => value.toFixed(1),
    },
  },
  {
    timestamps: true,
  }
);

export const UserCourseRating = model<IUserCourseRating, UserCourseRatingModel>(
  "UserCourseRating",
  userCourseRatingSchema
);
