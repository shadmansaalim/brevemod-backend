"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleRoutes = void 0;
// Imports
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const courseModule_controller_1 = require("./courseModule.controller");
const courseModule_validation_1 = require("./courseModule.validation");
// Express router
const router = express_1.default.Router();
// API Endpoints
router.get("/:courseId", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT, users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), courseModule_controller_1.CourseModuleController.getAllModulesByCourse);
router.get("/content-published/:courseId", courseModule_controller_1.CourseModuleController.isCourseContentPublished);
router.get("/content-valid/:courseId/:moduleId/:contentId", courseModule_controller_1.CourseModuleController.isValidContent);
router.post("/", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(courseModule_validation_1.CourseModuleValidation.createCourseModule), courseModule_controller_1.CourseModuleController.createCourseModule);
router.patch("/:moduleId", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(courseModule_validation_1.CourseModuleValidation.updateCourseModule), courseModule_controller_1.CourseModuleController.updateCourseModule);
router.patch("/add-content/:moduleId", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(courseModule_validation_1.CourseModuleValidation.addContentToCourseModule), courseModule_controller_1.CourseModuleController.addContentToCourseModule);
router.patch("/update-content/:moduleId/:contentId", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(courseModule_validation_1.CourseModuleValidation.updateContentInCourseModule), courseModule_controller_1.CourseModuleController.updateContentInCourseModule);
router.delete("/remove-content/:moduleId/:contentId", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), courseModule_controller_1.CourseModuleController.deleteContentFromCourseModule);
exports.CourseModuleRoutes = router;
