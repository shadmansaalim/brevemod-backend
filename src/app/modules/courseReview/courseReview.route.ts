// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { CourseReviewController } from "./courseReview.controller";

// Express router
const router = express.Router();

// API Endpoints
// router.get("/:courseId", CourseReviewController.addReviewToCourse);

router.post(
  "/:courseId",
  authGuard(ENUM_USER_ROLES.STUDENT),
  CourseReviewController.addReviewToCourse
);

export const CourseReviewRoutes = router;
