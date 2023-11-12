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
router.get(
  "/:courseId",
  authGuard(
    ENUM_USER_ROLES.STUDENT,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.SUPER_ADMIN
  ),
  CourseModuleController.getAllModulesByCourse
);

router.get(
  "/content-published/:courseId",
  CourseModuleController.isCourseContentPublished
);

router.get(
  "/content-valid/:courseId/:moduleId/:contentId",
  CourseModuleController.isValidContent
);

router.post(
  "/",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseModuleValidation.createCourseModule),
  CourseModuleController.createCourseModule
);

router.patch(
  "/:moduleId",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseModuleValidation.updateCourseModule),
  CourseModuleController.updateCourseModule
);

router.patch(
  "/add-content/:moduleId",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseModuleValidation.addContentToCourseModule),
  CourseModuleController.addContentToCourseModule
);

router.patch(
  "/update-content/:moduleId/:contentId",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseModuleValidation.addContentToCourseModule),
  CourseModuleController.addContentToCourseModule
);

router.delete(
  "/remove-content/:moduleId/:contentId",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseModuleValidation.addContentToCourseModule),
  CourseModuleController.addContentToCourseModule
);
export const CourseModuleRoutes = router;
