"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postResolvers = void 0;
// Imports
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const post_model_1 = require("../../../app/modules/post/post.model");
const user_model_1 = require("../../../app/modules/user/user.model");
exports.postResolvers = {
    addPost: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { post } = args;
        const author = context.user;
        if (!author) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to make a post.");
        }
        if (!post.content) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Post content is not provided.");
        }
        const postData = Object.assign(Object.assign({}, post), { authorId: author.id });
        const result = yield post_model_1.Post.create(postData);
        return {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Post added successfully.",
            data: result,
        };
    }),
    updatePost: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId, post } = args;
        const author = context.user;
        if (!author) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to update a post.");
        }
        const user = yield user_model_1.User.findOne({ _id: author.id });
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to update a post.");
        }
        if (!postId || !post.content) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Post id or content not provided.");
        }
        const postExists = yield post_model_1.Post.findOne({ _id: postId });
        if (!postExists) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Post does not exists.");
        }
        if (!postExists.authorId.equals(user.id)) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to update this post.");
        }
        // Updating
        postExists.content = post.content;
        const result = yield post_model_1.Post.findOneAndUpdate({ _id: postId }, postExists, {
            new: true,
        });
        return {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Post updated successfully.",
            data: result,
        };
    }),
    deletePost: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId } = args;
        const author = context.user;
        if (!author) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to delete a post.");
        }
        const user = yield user_model_1.User.findOne({ _id: author.id });
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to delete a post.");
        }
        if (!postId) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Post id is not provided.");
        }
        const postExists = yield post_model_1.Post.findOne({ _id: postId });
        if (!postExists) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Post does not exists.");
        }
        if (!postExists.authorId.equals(user.id)) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to delete this post.");
        }
        const result = yield post_model_1.Post.findOneAndDelete({ _id: postId });
        return {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Post deleted successfully.",
            data: result,
        };
    }),
    reactPost: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId, reaction } = args;
        const { user } = context;
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to react a post.");
        }
        const userData = yield user_model_1.User.findOne({ _id: user.id });
        if (!userData) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to react a post.");
        }
        if (!postId || !reaction) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Post id or reaction not provided.");
        }
        const postExists = yield post_model_1.Post.findOne({ _id: postId });
        if (!postExists) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Post does not exists.");
        }
        // New reaction
        const newReaction = {
            react: reaction,
            user: userData._id,
        };
        const postUpdatedReactions = postExists.reactions.filter((reaction) => !reaction.user.equals(userData._id));
        // Updating
        postExists.reactions = [...postUpdatedReactions, newReaction];
        const result = yield post_model_1.Post.findOneAndUpdate({ _id: postId }, postExists, {
            new: true,
        });
        return {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Reaction added to post successfully.",
            data: result,
        };
    }),
    removeReactionFromPost: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId } = args;
        const { user } = context;
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to remove reaction from a post.");
        }
        const userData = yield user_model_1.User.findOne({ _id: user.id });
        if (!userData) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to remove reaction from a post.");
        }
        if (!postId) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Post id not provided.");
        }
        const postExists = yield post_model_1.Post.findOne({ _id: postId });
        if (!postExists) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Post does not exists.");
        }
        const userReactionToPost = postExists.reactions.find((reaction) => reaction.user.equals(userData._id));
        if (!userReactionToPost) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You have no reaction in the post to remove.");
        }
        const updatedReactions = postExists.reactions.filter((reaction) => !reaction.user.equals(userData._id));
        // Updating
        postExists.reactions = [...updatedReactions];
        const result = yield post_model_1.Post.findOneAndUpdate({ _id: postId }, postExists, {
            new: true,
        });
        return {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Reaction from post removed successfully.",
            data: result,
        };
    }),
};
