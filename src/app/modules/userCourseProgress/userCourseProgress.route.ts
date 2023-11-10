// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import { UserCourseProgressController } from "./userCourseProgress.controller";

// Express router
const router = express.Router();

// API Endpoints

router.get(
  "/:courseId",
  authGuard(ENUM_USER_ROLES.STUDENT),
  UserCourseProgressController.getUserCourseProgress
);

// router.patch(
//   "/:courseId",
//   authGuard(ENUM_USER_ROLES.STUDENT),
//   UserCourseProgressController.updateUserCourseProgress
// );

export const UserCourseProgressRoutes = router;
