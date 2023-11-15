// Imports
import { Schema, model } from "mongoose";
import {
  IUserCourseProgress,
  UserCourseProgressModel,
} from "./userCourseProgress.interface";

const userCourseProgressSchema = new Schema<IUserCourseProgress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completed: {
      type: [
        {
          moduleId: {
            type: Schema.Types.ObjectId,
            ref: "CourseModule",
            required: true,
          },
          moduleNumber: {
            type: Number,
            required: true,
          },
          contentId: {
            type: Schema.Types.ObjectId,
            required: true,
          },
        },
      ],
      default: [],
    },
    current: {
      moduleId: {
        type: Schema.Types.ObjectId,
        ref: "CourseModule",
        required: true,
      },
      moduleNumber: {
        type: Number,
        required: true,
      },
      contentId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
    },
    completedContentCount: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const UserCourseProgress = model<
  IUserCourseProgress,
  UserCourseProgressModel
>("UserCourseProgress", userCourseProgressSchema);
