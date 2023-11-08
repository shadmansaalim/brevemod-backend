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
exports.FeedbackService = void 0;
const getAllDocuments_1 = __importDefault(require("../../../shared/getAllDocuments"));
const feedback_constant_1 = require("./feedback.constant");
const feedback_model_1 = require("./feedback.model");
const mongoose_1 = require("mongoose");
const insertIntoDb = (authUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.user = new mongoose_1.Types.ObjectId(authUserId);
    return yield (yield feedback_model_1.Feedback.create(payload)).populate({
        path: "user",
        select: "_id firstName middleName lastName email",
    });
});
const getAllFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, total, totalPage, result } = yield (0, getAllDocuments_1.default)(filters, paginationOptions, feedback_constant_1.FeedbackConstants.searchableFields, feedback_model_1.Feedback, feedback_constant_1.FeedbackConstants.fieldsToPopulate);
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
    return yield feedback_model_1.Feedback.findOne({ _id: id }).populate({
        path: "user",
        select: "_id firstName middleName lastName email",
    });
});
const getCurrentUserFeedback = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield feedback_model_1.Feedback.findOne({ user: authUserId }).populate({
        path: "user",
        select: "_id firstName middleName lastName email",
    });
});
const deleteOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield feedback_model_1.Feedback.findOneAndDelete({ _id: id }).populate({
        path: "user",
        select: "_id firstName middleName lastName email",
    });
});
exports.FeedbackService = {
    insertIntoDb,
    getAllFromDb,
    getOneById,
    getCurrentUserFeedback,
    deleteOneById,
};
