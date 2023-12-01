// Imports
import { Post } from "../../../app/modules/post/post.model";
import httpStatus from "http-status";
import { Context } from "../../../interfaces/common";
import { ENUM_USER_ROLES } from "../../../enums/users";
import { ENUM_POST_FILTERS } from "../../../enums/post";
import { Types } from "mongoose";

export const Query = {
  posts: async (parent: any, args: any, context: Context) => {
    const { filter } = args;
    const { user } = context;
    let result = null;

    if (filter === ENUM_POST_FILTERS.ADMIN_POSTS) {
      result = await Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $match: {
            parent: null,
            "author.role": ENUM_USER_ROLES.ADMIN,
            published: true,
          },
        },
        {
          $sort: {
            createdAt: -1, // Sort in descending order
          },
        },
      ]);
    } else if (filter === ENUM_POST_FILTERS.MY_POSTS) {
      result = await Post.find({
        parent: null,
        published: true,
        authorId: new Types.ObjectId(user?.id as string),
      }).sort({
        createdAt: "descending",
      });
    } else {
      result = await Post.find({ parent: null, published: true }).sort({
        createdAt: "descending",
      });
    }

    return {
      statusCode: httpStatus.OK,
      success: true,
      message: "Posts retrieved successfully.",
      data: result,
    };
  },
};
