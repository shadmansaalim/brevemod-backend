// Imports
import ApiError from "../../../errors/ApiError";
import { Context } from "../../../interfaces/common";
import httpStatus from "http-status";
import { Post } from "../../../app/modules/post/post.model";
import { Types } from "mongoose";
import { User } from "../../../app/modules/user/user.model";

export const postResolvers = {
  addPost: async (
    parent: any,
    args: { post: { content: string } },
    context: Context
  ) => {
    const { post } = args;
    const author = context.user;

    if (!author) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to make a post."
      );
    }

    if (!post.content) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Post content is not provided."
      );
    }

    const postData = { ...post, authorId: author.id };
    const result = await Post.create(postData);

    return {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post added successfully.",
      data: result,
    };
  },
  updatePost: async (
    parent: any,
    args: { postId: Types.ObjectId; post: { content: string } },
    context: Context
  ) => {
    const { postId, post } = args;
    const author = context.user;

    if (!author) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to update a post."
      );
    }

    const user = await User.findOne({ _id: author.id });

    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to update a post."
      );
    }

    if (!postId || !post.content) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Post id or content not provided."
      );
    }

    const postExists = await Post.findOne({ _id: postId });

    if (!postExists) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Post does not exists.");
    }

    if (!postExists.authorId.equals(user.id)) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to update this post."
      );
    }

    // Updating
    postExists.content = post.content;

    const result = await Post.findOneAndUpdate({ _id: postId }, postExists, {
      new: true,
    });

    return {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post updated successfully.",
      data: result,
    };
  },
  deletePost: async (
    parent: any,
    args: { postId: Types.ObjectId },
    context: Context
  ) => {
    const { postId } = args;
    const author = context.user;

    if (!author) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to delete a post."
      );
    }

    const user = await User.findOne({ _id: author.id });

    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to delete a post."
      );
    }

    if (!postId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Post id is not provided.");
    }

    const postExists = await Post.findOne({ _id: postId });

    if (!postExists) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Post does not exists.");
    }

    if (!postExists.authorId.equals(user.id)) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to delete this post."
      );
    }

    const result = await Post.findOneAndDelete({ _id: postId });

    return {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post deleted successfully.",
      data: result,
    };
  },
};
