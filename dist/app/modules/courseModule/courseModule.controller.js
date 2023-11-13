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
exports.CourseModuleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const courseModule_service_1 = require("./courseModule.service");
const createCourseModule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseModule_service_1.CourseModuleService.createCourseModule(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course Module created successfully.",
        data: result,
    });
}));
const updateCourseModule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleId } = req.params;
    const { moduleName } = req.body;
    const result = yield courseModule_service_1.CourseModuleService.updateCourseModule(moduleId, moduleName);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course Module updated successfully.",
        data: result,
    });
}));
const addContentToCourseModule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleId } = req.params;
    const result = yield courseModule_service_1.CourseModuleService.addContentToCourseModule(moduleId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Content added to module successfully.",
        data: result,
    });
}));
const updateContentInCourseModule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleId, contentId } = req.params;
    const result = yield courseModule_service_1.CourseModuleService.updateContentInCourseModule(moduleId, contentId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Content updated in module successfully.",
        data: result,
    });
}));
const deleteContentFromCourseModule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleId, contentId } = req.params;
    const result = yield courseModule_service_1.CourseModuleService.deleteContentFromCourseModule(moduleId, contentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Content deleted from module successfully.",
        data: result,
    });
}));
const getAllModulesByCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting authenticated user from request
    const user = req.user;
    const { courseId } = req.params;
    const result = yield courseModule_service_1.CourseModuleService.getAllModulesByCourse(user.role, courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course modules retrieved successfully.",
        data: result,
    });
}));
const isCourseContentPublished = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const result = yield courseModule_service_1.CourseModuleService.isCourseContentPublished(courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course content publishing status retrieved successfully.",
        data: result,
    });
}));
const isValidContent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, moduleId, contentId } = req.params;
    const result = yield courseModule_service_1.CourseModuleService.isValidContent(courseId, moduleId, contentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course content validity status retrieved successfully.",
        data: result,
    });
}));
exports.CourseModuleController = {
    createCourseModule,
    updateCourseModule,
    addContentToCourseModule,
    updateContentInCourseModule,
    deleteContentFromCourseModule,
    getAllModulesByCourse,
    isCourseContentPublished,
    isValidContent,
};
