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
exports.Query = void 0;
// Imports
const post_model_1 = require("../../../app/modules/post/post.model");
const http_status_1 = __importDefault(require("http-status"));
const users_1 = require("../../../enums/users");
const post_1 = require("../../../enums/post");
const mongoose_1 = require("mongoose");
exports.Query = {
    posts: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { filter } = args;
        const { user } = context;
        let result = null;
        if (filter === post_1.ENUM_POST_FILTERS.ADMIN_POSTS) {
            result = yield post_model_1.Post.aggregate([
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
                        "author.role": users_1.ENUM_USER_ROLES.ADMIN,
                        published: true,
                    },
                },
                {
                    $sort: {
                        createdAt: -1, // Sort in descending order
                    },
                },
            ]);
        }
        else if (filter === post_1.ENUM_POST_FILTERS.MY_POSTS) {
            result = yield post_model_1.Post.find({
                parent: null,
                published: true,
                authorId: new mongoose_1.Types.ObjectId(user === null || user === void 0 ? void 0 : user.id),
            }).sort({
                createdAt: "descending",
            });
        }
        else {
            result = yield post_model_1.Post.find({ parent: null, published: true }).sort({
                createdAt: "descending",
            });
        }
        return {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Posts retrieved successfully.",
            data: result,
        };
    }),
};
