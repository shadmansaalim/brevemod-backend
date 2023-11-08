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
exports.CourseService = void 0;
const getAllDocuments_1 = __importDefault(require("../../../shared/getAllDocuments"));
const course_model_1 = require("./course.model");
const course_constant_1 = require("./course.constant");
const mongoose_1 = require("mongoose");
const user_model_1 = require("../user/user.model");
const mongoose_2 = __importDefault(require("mongoose"));
const courseReview_model_1 = require("../courseReview/courseReview.model");
const insertIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_model_1.Course.create(payload);
});
const getAllFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, total, totalPage, result } = yield (0, getAllDocuments_1.default)(filters, paginationOptions, course_constant_1.CourseConstants.searchableFields, course_model_1.Course);
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
    return yield course_model_1.Course.findOne({ _id: id });
});
const updateOneById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_model_1.Course.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
});
const deleteOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding users those who purchased the course
    const studentsOfThisCourse = yield user_model_1.User.find({ purchases: { $elemMatch: { $eq: new mongoose_1.Types.ObjectId(id) } } }, { _id: 1 });
    // Deleting the course if no students enrolled in this course
    if (!studentsOfThisCourse) {
        return yield course_model_1.Course.findOneAndDelete({ _id: id });
    }
    let deletedCourseData = null;
    // Mongoose session started
    const session = yield mongoose_2.default.startSession();
    try {
        // Starting Transaction
        session.startTransaction();
        // Removing this course from students purchases field
        yield user_model_1.User.updateMany({ purchases: new mongoose_1.Types.ObjectId(id) }, { $pull: { purchases: new mongoose_1.Types.ObjectId(id) } }, { multi: true });
        // Removing all the reviews of the course
        yield courseReview_model_1.CourseReview.deleteMany({ course: new mongoose_1.Types.ObjectId(id) });
        // Deleting the course
        deletedCourseData = yield course_model_1.Course.findOneAndDelete({ _id: id });
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
    return deletedCourseData;
});
exports.CourseService = {
    insertIntoDb,
    getAllFromDb,
    getOneById,
    updateOneById,
    deleteOneById,
};
