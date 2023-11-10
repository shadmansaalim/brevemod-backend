// Imports
import { Schema, model } from "mongoose";
import { CourseModuleModel, ICourseModule } from "./courseModule.interface";
import { Types } from "mongoose";

const moduleContentSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
  },
});

const courseModuleSchema = new Schema<ICourseModule>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    moduleNumber: {
      type: Number,
      required: true,
    },
    moduleName: {
      type: String,
      required: true,
    },
    moduleContents: {
      type: [moduleContentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const CourseModule = model<ICourseModule, CourseModuleModel>(
  "CourseModule",
  courseModuleSchema
);
