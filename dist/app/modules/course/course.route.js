"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
// Imports
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const course_controller_1 = require("./course.controller");
const course_validation_1 = require("./course.validation");
// Express router
const router = express_1.default.Router();
// API Endpoints
router.get("/:id", course_controller_1.CourseController.getOneById);
router.get("/", course_controller_1.CourseController.getAllFromDb);
router.post("/", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(course_validation_1.CourseValidation.create), course_controller_1.CourseController.insertIntoDb);
router.patch("/:id", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(course_validation_1.CourseValidation.update), course_controller_1.CourseController.updateOneById);
router.delete("/:id", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), course_controller_1.CourseController.deleteOneById);
exports.CourseRoutes = router;
