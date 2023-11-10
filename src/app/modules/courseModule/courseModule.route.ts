// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { CourseModuleController } from "./courseModule.controller";
import { CourseModuleValidation } from "./courseModule.validation";

// Express router
const router = express.Router();

// API Endpoints
router.get("/:courseId", CourseModuleController.getAllModulesByCourse);

router.post(
  "/",
  // authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseModuleValidation.createCourseModule),
  CourseModuleController.createCourseModule
);

router.patch(
  "/add-content/:moduleId",
  // authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseModuleValidation.addContentToCourseModule),
  CourseModuleController.addContentToCourseModule
);

export const CourseModuleRoutes = router;
