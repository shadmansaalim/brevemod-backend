// Imports
import { Post } from "../../../app/modules/post/post.model";
import httpStatus from "http-status";
import { Context } from "../../../interfaces/common";

export const Query = {
  posts: async (parent: any, args: any, context: Context) => {
    const result = await Post.find({ published: true }).sort({
      createdAt: "descending",
    });

    return {
      statusCode: httpStatus.OK,
      success: true,
      message: "Posts retrieved successfully.",
      data: result,
    };
  },
};
