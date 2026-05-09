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
exports.UserCourseProgressService = void 0;
// Imports
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const courseModule_model_1 = require("../courseModule/courseModule.model");
const userCourseProgress_model_1 = require("./userCourseProgress.model");
const mongoose_1 = require("mongoose");
const startCourse = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding course first module
    const courseFirstModule = yield courseModule_model_1.CourseModule.findOne({
        courseId,
        moduleNumber: 1,
    });
    if (!courseFirstModule || courseFirstModule.moduleContents.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `Course content is not ready yet.`);
    }
    // Throwing error if first module not found
    const userProgress = yield userCourseProgress_model_1.UserCourseProgress.create({
        user: userId,
        courseId,
        current: {
            moduleId: courseFirstModule._id,
            moduleNumber: courseFirstModule.moduleNumber,
            contentId: courseFirstModule.moduleContents[0]._id,
        },
    });
    return userProgress;
});
const getUserCourseProgress = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userCourseProgress_model_1.UserCourseProgress.findOne({ user: userId, courseId });
});
const updateUserCourseProgress = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding user progress
    const userProgress = yield userCourseProgress_model_1.UserCourseProgress.findOne({
        user: userId,
        courseId,
    });
    // Throwing error if user progress data not found
    if (!userProgress) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `User has not started course yet.`);
    }
    // Throwing error if user progress is already 100%
    if (userProgress.percentage === 100) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `User progress is already 100% nothing to update.`);
    }
    // Moving the current content to completed
    userProgress.completed = [...userProgress.completed, userProgress.current];
    userProgress.completedContentCount += 1;
    // Finding current module
    const currentModule = yield courseModule_model_1.CourseModule.findOne({
        _id: userProgress.current.moduleId,
    });
    // Throwing error if fails
    if (!currentModule) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Something went wrong.`);
    }
    const currentContentIndex = currentModule.moduleContents.findIndex((content) => content._id.equals(userProgress.current.contentId));
    // Throwing error if fails
    if (currentContentIndex === -1) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Something went wrong.`);
    }
    // Move to next content in same module
    if (currentContentIndex != currentModule.moduleContents.length - 1) {
        // Next content
        const nextContent = currentModule.moduleContents[currentContentIndex + 1];
        userProgress.current.contentId = nextContent._id;
    }
    // Move to next module first content
    else {
        // Next module
        const nextModule = yield courseModule_model_1.CourseModule.findOne({
            courseId,
            moduleNumber: currentModule.moduleNumber + 1,
        });
        // Throwing error if there is no next module
        if (nextModule && nextModule.moduleContents.length) {
            // Next Module first content
            const moduleFirstContent = nextModule.moduleContents[0];
            userProgress.current = {
                moduleId: nextModule._id,
                moduleNumber: nextModule.moduleNumber,
                contentId: moduleFirstContent._id,
            };
        }
    }
    // Total module contents for this course
    const totalModuleContents = yield courseModule_model_1.CourseModule.aggregate([
        {
            $match: { courseId: new mongoose_1.Types.ObjectId(courseId) },
        },
        {
            $project: {
                moduleContentsCount: { $size: "$moduleContents" },
            },
        },
        {
            $group: {
                _id: null,
                count: { $sum: "$moduleContentsCount" },
            },
        },
    ]);
    // Calculating progress percentage
    userProgress.percentage = Math.round((userProgress.completedContentCount / totalModuleContents[0].count) * 100);
    const updateProgress = yield userCourseProgress_model_1.UserCourseProgress.findOneAndUpdate({ user: userId, courseId }, userProgress, { new: true });
    return updateProgress;
});
exports.UserCourseProgressService = {
    startCourse,
    getUserCourseProgress,
    updateUserCourseProgress,
};
