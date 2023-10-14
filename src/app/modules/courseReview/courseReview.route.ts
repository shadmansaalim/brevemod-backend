// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { CourseReviewController } from "./courseReview.controller";
import { CourseReviewValidation } from "./courseReview.validation";

// Express router
const router = express.Router();

// API Endpoints
router.get("/:courseId", CourseReviewController.getReviewsByCourse);

router.post(
  "/:courseId",
  authGuard(ENUM_USER_ROLES.STUDENT),
  validateRequest(CourseReviewValidation.create),
  CourseReviewController.addReviewToCourse
);

export const CourseReviewRoutes = router;
