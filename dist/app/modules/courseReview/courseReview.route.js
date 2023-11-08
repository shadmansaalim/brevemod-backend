"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseReviewRoutes = void 0;
// Imports
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const courseReview_controller_1 = require("./courseReview.controller");
const courseReview_validation_1 = require("./courseReview.validation");
// Express router
const router = express_1.default.Router();
// API Endpoints
router.get("/:courseId", courseReview_controller_1.CourseReviewController.getReviewsByCourse);
router.post("/:courseId", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT), (0, validateRequest_1.default)(courseReview_validation_1.CourseReviewValidation.create), courseReview_controller_1.CourseReviewController.addReviewToCourse);
exports.CourseReviewRoutes = router;
