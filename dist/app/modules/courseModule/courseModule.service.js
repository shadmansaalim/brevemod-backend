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
exports.CourseModuleService = void 0;
// Imports
const mongoose_1 = require("mongoose");
const courseModule_model_1 = require("./courseModule.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const users_1 = require("../../../enums/users");
const createCourseModule = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const courseModulesCount = yield courseModule_model_1.CourseModule.find({
        courseId: new mongoose_1.Types.ObjectId(payload.courseId),
    }).count();
    // Setting the module number
    payload.moduleNumber = courseModulesCount + 1;
    return yield courseModule_model_1.CourseModule.create(Object.assign({}, payload));
});
const updateCourseModule = (moduleId, moduleName) => __awaiter(void 0, void 0, void 0, function* () {
    return yield courseModule_model_1.CourseModule.findOneAndUpdate({
        _id: moduleId,
    }, {
        moduleName,
    }, { new: true });
});
const addContentToCourseModule = (moduleId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding course module
    const courseModule = yield courseModule_model_1.CourseModule.findOne({
        _id: new mongoose_1.Types.ObjectId(moduleId),
    });
    // Throwing error if course module not found
    if (!courseModule) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course Module does not exists.");
    }
    // Adding the content to course module
    const result = yield courseModule_model_1.CourseModule.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(moduleId) }, {
        $push: {
            moduleContents: Object.assign({}, payload),
        },
    }, { new: true });
    return result;
});
const updateContentInCourseModule = (moduleId, contentId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding course module
    const courseModule = yield courseModule_model_1.CourseModule.findOne({
        _id: new mongoose_1.Types.ObjectId(moduleId),
    });
    // Throwing error if course module not found
    if (!courseModule) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course Module does not exists.");
    }
    // Module contents
    const moduleContents = courseModule === null || courseModule === void 0 ? void 0 : courseModule.moduleContents;
    // Throwing error if module contents is empty
    if (!moduleContents.length) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "The module has no content to update.");
    }
    // Finding index
    const indexOfContentToUpdate = moduleContents.findIndex((content) => content._id.equals(contentId));
    if (indexOfContentToUpdate === -1) {
        // Throwing error if content is not found in module
        if (!moduleContents.length) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Content does not exists in module.");
        }
    }
    // Delete the content at the specified index
    moduleContents.splice(indexOfContentToUpdate, 1);
    // Inserting the updated content at the same index
    moduleContents.splice(indexOfContentToUpdate, 0, Object.assign({}, payload));
    // Updating content
    const result = yield courseModule_model_1.CourseModule.findOneAndUpdate({ _id: moduleId }, { moduleContents }, { new: true });
    return result;
});
const deleteContentFromCourseModule = (moduleId, contentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding course module
    const courseModule = yield courseModule_model_1.CourseModule.findOne({
        _id: new mongoose_1.Types.ObjectId(moduleId),
    });
    // Throwing error if course module not found
    if (!courseModule) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course Module does not exists.");
    }
    const newModuleContents = courseModule.moduleContents.filter((content) => !content._id.equals(contentId));
    // Updating content
    const result = yield courseModule_model_1.CourseModule.findOneAndUpdate({ _id: moduleId }, {
        moduleContents: newModuleContents,
    }, { new: true });
    return result;
});
const getAllModulesByCourse = (userRole, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const searchingConditions = { courseId };
    // For students just retrieving modules with content
    if (userRole === users_1.ENUM_USER_ROLES.STUDENT) {
        searchingConditions["moduleContents.0"] = { $exists: true };
    }
    return yield courseModule_model_1.CourseModule.find(searchingConditions).sort({
        moduleNumber: "asc",
    });
});
const isCourseContentPublished = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding course module for this course
    const courseModuleAvailable = yield courseModule_model_1.CourseModule.findOne({ courseId });
    // Returning false if no module
    if (!courseModuleAvailable || !courseModuleAvailable.moduleContents.length) {
        return false;
    }
    else {
        return true;
    }
});
const isValidContent = (courseId, moduleId, contentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding course module for this course
    const courseModule = yield courseModule_model_1.CourseModule.findOne({
        _id: moduleId,
        courseId,
    });
    // Returning false if no module
    if (!courseModule || !courseModule.moduleContents.length) {
        return false;
    }
    // Finding requested content
    const requestedContent = courseModule.moduleContents.find((content) => content._id.equals(contentId));
    if (requestedContent) {
        return true;
    }
    else {
        return false;
    }
});
exports.CourseModuleService = {
    createCourseModule,
    updateCourseModule,
    addContentToCourseModule,
    updateContentInCourseModule,
    deleteContentFromCourseModule,
    getAllModulesByCourse,
    isCourseContentPublished,
    isValidContent,
};
