// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { CourseController } from "./course.controller";
import { CourseValidation } from "./course.validation";

// Express router
const router = express.Router();

// API Endpoints
router.get("/:courseId", CourseController.getOneById);

router.get("/", CourseController.getAllFromDb);

router.post(
  "/",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseValidation.create),
  CourseController.insertIntoDb
);

router.patch(
  "/:courseId",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseValidation.update),
  CourseController.updateOneById
);

router.delete(
  "/:courseId",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  CourseController.deleteOneById
);

export const CourseRoutes = router;
