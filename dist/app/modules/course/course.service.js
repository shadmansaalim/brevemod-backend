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
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const purchase_model_1 = require("../purchase/purchase.model");
const userCourseRating_model_1 = require("../userCourseRating/userCourseRating.model");
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
    return yield course_model_1.Course.findOne({ _id: new mongoose_1.Types.ObjectId(id) });
});
const updateOneById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_model_1.Course.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(id) }, payload, {
        new: true,
    });
});
const deleteOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding users those who purchased the course
    const studentsOfThisCourse = yield purchase_model_1.Purchase.find({
        courses: { $elemMatch: { $eq: new mongoose_1.Types.ObjectId(id) } },
    });
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
        // Removing this course from students purchases
        yield purchase_model_1.Purchase.updateMany({ courses: new mongoose_1.Types.ObjectId(id) }, { $pull: { courses: new mongoose_1.Types.ObjectId(id) } }, { multi: true });
        // Removing all the ratings of the course
        yield userCourseRating_model_1.UserCourseRating.deleteMany({ course: new mongoose_1.Types.ObjectId(id) });
        // Deleting the course
        deletedCourseData = yield course_model_1.Course.findOneAndDelete({
            _id: new mongoose_1.Types.ObjectId(id),
        });
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
const addCourseRating = (authUserId, courseId, rating) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding user
    const user = yield user_model_1.User.findOne({ _id: authUserId });
    // Throwing error if user does not exists
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    const course = yield course_model_1.Course.findOne({ _id: courseId });
    // Throwing error if course does not exists
    if (!course) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course does not exists.");
    }
    const userPurchases = yield purchase_model_1.Purchase.findOne({ user: authUserId });
    // Throwing error if user didn't purchase
    if (!userPurchases || !userPurchases.courses.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You have not purchased this course.");
    }
    const isCoursePurchasedByUser = userPurchases.courses.find((course) => course.equals(courseId));
    // Throwing error if user didn't purchase
    if (!isCoursePurchasedByUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You have not purchased this course.");
    }
    const userAlreadyReviewed = yield userCourseRating_model_1.UserCourseRating.findOne({
        courseId,
        user: authUserId,
    });
    // Throwing error if user already reviewed this course
    if (userAlreadyReviewed) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You already gave your review for this course.");
    }
    let newUserRating = null;
    // Mongoose session started
    const session = yield mongoose_2.default.startSession();
    try {
        // Starting Transaction
        session.startTransaction();
        // Add new review
        newUserRating = yield userCourseRating_model_1.UserCourseRating.create({
            courseId,
            user: authUserId,
            rating,
        });
        // Calculating new avg rating
        const totalRating = course.totalRating + rating;
        const ratingCount = course.ratingCount + 1;
        const avgRating = totalRating / ratingCount;
        // Updating avg rating in course
        yield course_model_1.Course.findOneAndUpdate({ _id: courseId }, { totalRating, ratingCount, avgRating });
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
    return newUserRating;
});
const getUserCourseRating = (authUserId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userCourseRating_model_1.UserCourseRating.findOne({ courseId, user: authUserId });
});
exports.CourseService = {
    insertIntoDb,
    getAllFromDb,
    getOneById,
    updateOneById,
    deleteOneById,
    addCourseRating,
    getUserCourseRating,
};
