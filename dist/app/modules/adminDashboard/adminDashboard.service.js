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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardService = void 0;
// Imports
const course_model_1 = require("../course/course.model");
const user_model_1 = require("../user/user.model");
const courseReview_model_1 = require("../courseReview/courseReview.model");
const feedback_model_1 = require("../feedback/feedback.model");
// This function is to fetch data that needs to be displayed in admin dashboard based on requirements
const getAdminDashboardData = () => __awaiter(void 0, void 0, void 0, function* () {
    // Courses count
    const coursesCount = yield course_model_1.Course.countDocuments({});
    // Users count
    const usersCount = yield user_model_1.User.countDocuments({});
    // Course Reviews count
    const courseReviewsCount = yield courseReview_model_1.CourseReview.countDocuments({});
    // Feedbacks count
    const feedbacksCount = yield feedback_model_1.Feedback.countDocuments({});
    return {
        coursesCount,
        usersCount,
        courseReviewsCount,
        feedbacksCount,
    };
});
exports.AdminDashboardService = {
    getAdminDashboardData,
};
