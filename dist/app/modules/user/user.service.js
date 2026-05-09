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
const cart_model_1 = require("../cart/cart.model");
const purchase_model_1 = require("../purchase/purchase.model");
const mongoose_2 = __importDefault(require("mongoose"));
const insertIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.password) {
        payload.password = config_1.default.default_user_password;
    }
    let newUser = null;
    // Mongoose session started
    const session = yield mongoose_2.default.startSession();
    try {
        // Starting Transaction
        session.startTransaction();
        // Creating new user
        newUser = yield user_model_1.User.create(payload);
        // Throwing error if fails to create user
        if (!newUser) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Failed to create an user`);
        }
        // Creating cart document for user
        const userCart = yield cart_model_1.Cart.create({ user: newUser._id });
        // Throwing error if fails
        if (!userCart) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Failed to create an user.`);
        }
        // Creating purchases document for user
        const userPurchases = yield purchase_model_1.Purchase.create({ user: newUser._id });
        // Throwing error if fails
        if (!userPurchases) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Failed to create an user.`);
        }
        // Committing Transaction
        yield session.commitTransaction();
        // Ending Session
        yield session.endSession();
    }
    catch (error) {
        // Aborting Transaction because of error
        yield session.abortTransaction();
        // Ending Session because of error
        yield session.endSession();
        // Throwing error
        throw error;
    }
    return newUser;
});
const getAllFromDb = (authUserId, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, total, totalPage, result } = yield (0, getAllDocuments_1.default)(filters, paginationOptions, user_constant_1.UserConstants.searchableFields, user_model_1.User);
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
    return yield user_model_1.User.findOne({ _id: id });
});
const updateOneById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
});
const deleteOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOneAndDelete({ _id: id });
});
exports.UserService = {
    insertIntoDb,
    getAllFromDb,
    getOneById,
    updateOneById,
    deleteOneById,
};
