"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCourseProgressRoutes = void 0;
// Imports
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const userCourseProgress_controller_1 = require("./userCourseProgress.controller");
// Express router
const router = express_1.default.Router();
// API Endpoints
router.get("/:courseId", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT), userCourseProgress_controller_1.UserCourseProgressController.getUserCourseProgress);
router.post("/start-course/:courseId", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT), userCourseProgress_controller_1.UserCourseProgressController.startCourse);
router.patch("/:courseId", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT), userCourseProgress_controller_1.UserCourseProgressController.updateUserCourseProgress);
exports.UserCourseProgressRoutes = router;
