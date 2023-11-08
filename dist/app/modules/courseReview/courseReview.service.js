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
exports.CourseReviewService = void 0;
// Imports
const courseReview_model_1 = require("./courseReview.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const course_model_1 = require("../course/course.model");
const addReviewToCourse = (courseId, authUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding user
    const user = yield user_model_1.User.findOne({ _id: authUserId }).populate("purchases");
    // Throwing error if user does not exists
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    const course = yield course_model_1.Course.findOne({ _id: courseId });
    // Throwing error if course does not exists
    if (!course) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course does not exists.");
    }
    const userPurchasedCourse = user.purchases.find((course) => course._id.toString() === courseId);
    // Throwing error if user tries to review a course which he didn't purchase
    if (!userPurchasedCourse) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You cannot review a course which you didn't purchase.");
    }
    const userAlreadyReviewed = yield courseReview_model_1.CourseReview.findOne({
        course: courseId,
        user: authUserId,
    });
    // Throwing error if user already reviewed this course
    if (userAlreadyReviewed) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You already gave your review for this course.");
    }
    let newReviewData = null;
    // Mongoose session started
    const session = yield mongoose_1.default.startSession();
    try {
        // Starting Transaction
        session.startTransaction();
        // Add new review
        newReviewData = yield courseReview_model_1.CourseReview.create(Object.assign({ course: courseId, user: authUserId }, payload));
        // Calculating new avg rating
        const totalRating = course.totalRating + payload.rating;
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
    return newReviewData;
});
const getReviewsByCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield courseReview_model_1.CourseReview.find({ course: courseId }).populate("user", "firstName middleName lastName email");
});
exports.CourseReviewService = {
    addReviewToCourse,
    getReviewsByCourse,
};
