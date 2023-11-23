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
const mongoose_2 = __importDefault(require("mongoose"));
const userCourseProgress_model_1 = require("../userCourseProgress/userCourseProgress.model");
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
    if (courseModule === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course Module does not exists.");
    }
    let newModuleData = null;
    // Mongoose session started
    const session = yield mongoose_2.default.startSession();
    try {
        // Starting Transaction
        session.startTransaction();
        // Adding the content to course module
        newModuleData = yield courseModule_model_1.CourseModule.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(moduleId) }, {
            $push: {
                moduleContents: Object.assign({}, payload),
            },
        }, { new: true });
        if (!newModuleData) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to add new content.");
        }
        const newAddedContent = newModuleData.moduleContents[newModuleData.moduleContents.length - 1];
        if (!newAddedContent) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to add new content.");
        }
        // Total module contents for this course
        const totalModuleContents = yield courseModule_model_1.CourseModule.aggregate([
            {
                $match: { courseId: new mongoose_1.Types.ObjectId(newModuleData.courseId) },
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
        const newTotalContentCount = totalModuleContents[0].count;
        // Find all users course progresses for this course
        const usersCourseProgresses = yield userCourseProgress_model_1.UserCourseProgress.find({
            courseId: newModuleData.courseId,
        });
        // Updating each user course progress data
        for (const data of usersCourseProgresses) {
            if (data.percentage === 100) {
                data.current = {
                    moduleId: newModuleData._id,
                    moduleNumber: newModuleData.moduleNumber,
                    contentId: newAddedContent._id,
                };
            }
            // User new progress percentage
            data.percentage = Math.round((data.completedContentCount / newTotalContentCount) * 100);
            const updateProgress = yield userCourseProgress_model_1.UserCourseProgress.findOneAndUpdate({
                user: data.user,
                courseId: data.courseId,
            }, data, { new: true });
            if (!updateProgress) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update user new progress data.");
            }
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
    return newModuleData;
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
    let newModuleData = null;
    // Mongoose session started
    const session = yield mongoose_2.default.startSession();
    try {
        // Starting Transaction
        session.startTransaction();
        // Current content index
        const currentContentIndex = courseModule.moduleContents.findIndex((content) => content._id.equals(contentId));
        const previousContent = courseModule === null || courseModule === void 0 ? void 0 : courseModule.moduleContents[currentContentIndex - 1];
        const previousModule = yield courseModule_model_1.CourseModule.findOne({
            moduleNumber: courseModule.moduleNumber - 1,
        });
        if (!previousContent && !previousModule) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "This is the last content in course. Courses should have at least one content for students.");
        }
        // Total module contents for this course
        const totalModuleContents = yield courseModule_model_1.CourseModule.aggregate([
            {
                $match: { courseId: new mongoose_1.Types.ObjectId(courseModule.courseId) },
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
        const newTotalContentCount = totalModuleContents[0].count - 1;
        // Find all users course progresses for this course
        const usersCourseProgresses = yield userCourseProgress_model_1.UserCourseProgress.find({
            courseId: courseModule.courseId,
        });
        // Updating each user course progress data
        for (const data of usersCourseProgresses) {
            // Check if user current content is this removed one
            if (data.current.contentId.equals(contentId)) {
                if (currentContentIndex !== 0 && previousContent) {
                    data.current.contentId = previousContent._id;
                }
                else {
                    if (!previousModule) {
                        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "This is the last content in course. Courses should have at least one content for students.");
                    }
                    const previousModuleLastContent = previousModule.moduleContents[previousModule.moduleContents.length - 1];
                    data.current.moduleId = previousModule._id;
                    data.current.moduleNumber = previousModule.moduleNumber;
                    data.current.contentId = previousModuleLastContent._id;
                }
            }
            const didUserCompletedTheRemovedContent = data.completed.find((content) => content.contentId.equals(contentId));
            if (didUserCompletedTheRemovedContent) {
                const userNewCompleteList = data.completed.filter((content) => !content.contentId.equals(contentId));
                data.completed = [...userNewCompleteList];
                data.completedContentCount -= 1;
            }
            // User new progress percentage
            data.percentage = Math.round((data.completedContentCount / newTotalContentCount) * 100);
            const updateProgress = yield userCourseProgress_model_1.UserCourseProgress.findOneAndUpdate({
                user: data.user,
                courseId: data.courseId,
            }, data, { new: true });
            if (!updateProgress) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update user new progress data.");
            }
        }
        if (currentContentIndex === 0) {
            newModuleData = yield courseModule_model_1.CourseModule.findOneAndDelete({ _id: moduleId });
            if (!newModuleData) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to remove content.");
            }
            // Update the serial numbers of the remaining documents
            const updatingModuleNumber = yield courseModule_model_1.CourseModule.updateMany({ moduleNumber: { $gt: newModuleData.moduleNumber } }, { $inc: { moduleNumber: -1 } });
            if (!updatingModuleNumber) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to remove content.");
            }
        }
        else {
            // Removing content
            const newModuleContents = courseModule.moduleContents.filter((content) => !content._id.equals(contentId));
            // Updating module
            newModuleData = yield courseModule_model_1.CourseModule.findOneAndUpdate({ _id: moduleId }, {
                moduleContents: newModuleContents,
            }, { new: true });
            if (!newModuleData) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to remove the content.");
            }
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
    return newModuleData;
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
