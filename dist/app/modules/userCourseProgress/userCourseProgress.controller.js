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
exports.UserCourseProgressController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const userCourseProgress_service_1 = require("./userCourseProgress.service");
const startCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting authenticated user from request
    const user = req.user;
    const { courseId } = req.params;
    const result = yield userCourseProgress_service_1.UserCourseProgressService.startCourse(user.id, courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User course started successfully.",
        data: result,
    });
}));
const getUserCourseProgress = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting authenticated user from request
    const user = req.user;
    const { courseId } = req.params;
    const result = yield userCourseProgress_service_1.UserCourseProgressService.getUserCourseProgress(user.id, courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User course progress retrieved successfully",
        data: result,
    });
}));
const updateUserCourseProgress = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting authenticated user from request
    const user = req.user;
    const { courseId } = req.params;
    const result = yield userCourseProgress_service_1.UserCourseProgressService.updateUserCourseProgress(user.id, courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User course progress updated successfully",
        data: result,
    });
}));
exports.UserCourseProgressController = {
    startCourse,
    getUserCourseProgress,
    updateUserCourseProgress,
};
