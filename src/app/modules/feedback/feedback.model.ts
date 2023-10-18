// Imports
import { Schema, model } from "mongoose";
import { FeedbackModel, IFeedback } from "./feedback.interface";

const feedbackSchema = new Schema<IFeedback>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = model<IFeedback, FeedbackModel>(
  "Feedback",
  feedbackSchema
);
