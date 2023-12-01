//Imports
import { Model } from "mongoose";
import { Types } from "mongoose";
import { ENUM_POST_REACTIONS } from "../../../enums/post";

export type IPost = {
  _id: Types.ObjectId;
  content: string;
  authorId: Types.ObjectId;
  published: Boolean;
  reactions: {
    react: ENUM_POST_REACTIONS;
    user: Types.ObjectId;
  }[];
};

export type PostModel = Model<IPost>;
