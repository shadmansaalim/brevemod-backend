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
exports.UserService = void 0;
const getAllDocuments_1 = __importDefault(require("../../../shared/getAllDocuments"));
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const mongoose_1 = require("mongoose");
const insertIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.password) {
        payload.password = config_1.default.default_user_password;
    }
    const newUser = yield user_model_1.User.create(payload);
    // Throwing error if fails to create user
    if (!newUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Failed to create an user`);
    }
    return newUser;
});
const getAllFromDb = (authUserId, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, total, totalPage, result } = yield (0, getAllDocuments_1.default)(filters, paginationOptions, user_constant_1.UserConstants.searchableFields, user_model_1.User, user_constant_1.UserConstants.fieldsToPopulate);
    // Storing current user record at first index of result array
    const currentUserIndexInResult = result.findIndex((user) => user === null || user === void 0 ? void 0 : user._id.equals(new mongoose_1.Types.ObjectId(authUserId)));
    const currentUser = result.find((user) => user === null || user === void 0 ? void 0 : user._id.equals(new mongoose_1.Types.ObjectId(authUserId)));
    if (currentUserIndexInResult !== -1) {
        result.splice(currentUserIndexInResult, 1);
        result.unshift(currentUser);
    }
    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        data: result,
    };
});
const getOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOne({ _id: id })
        .populate({
        path: "cart",
        populate: [
            {
                path: "courses",
            },
        ],
    })
        .populate({
        path: "purchases",
    });
});
const updateOneById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    })
        .populate({
        path: "cart",
        populate: [
            {
                path: "courses",
            },
        ],
    })
        .populate({
        path: "purchases",
    });
});
const deleteOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOneAndDelete({ _id: id })
        .populate({
        path: "cart",
        populate: [
            {
                path: "courses",
            },
        ],
    })
        .populate({
        path: "purchases",
    });
});
exports.UserService = {
    insertIntoDb,
    getAllFromDb,
    getOneById,
    updateOneById,
    deleteOneById,
};
