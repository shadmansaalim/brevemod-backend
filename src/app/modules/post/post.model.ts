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
    media: {
      type: postMediaSchema,
      default: null,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    reactions: {
      type: [postReactionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Setting the default value for children and reactions in the constructor
postSchema.pre<IPost>("save", function (next) {
  const children = this.children;
  const reactions = this.reactions;

  if (!children) {
    this.children = [];
  }
  if (!reactions) {
    this.reactions = [];
  }
  next();
});

export const Post = model<IPost, PostModel>("Post", postSchema);
