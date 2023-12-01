// Imports
import { Schema, model } from "mongoose";
import { ENUM_POST_REACTIONS } from "../../../enums/post";
import { IPost, PostModel } from "./post.interface";

const postMediaSchema = new Schema({
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const postReactionSchema = new Schema({
  react: {
    type: String,
    enum: Object.values(ENUM_POST_REACTIONS),
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: true,
    },
    // media: {
    //   type: postMediaSchema,
    //   default: null,
    // },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    reactions: {
      type: [postReactionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Post = model<IPost, PostModel>("Post", postSchema);
