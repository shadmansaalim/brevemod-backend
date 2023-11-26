//Imports
import { Model } from "mongoose";
import { Types } from "mongoose";
import { ENUM_POST_REACTIONS } from "../../../enums/post";

export type IPost = {
  _id: Types.ObjectId;
  content: string;
  media?: {
    type: "image" | "video";
    url: string;
  } | null;
  authorId: Types.ObjectId;
  published: Boolean;
  parent?: Types.ObjectId | null;
  children?: Types.ObjectId[];
  reactions: {
    react: ENUM_POST_REACTIONS;
    user: Types.ObjectId;
  }[];
};

export type PostModel = Model<IPost>;
