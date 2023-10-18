// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { FeedbackController } from "./feedback.controller";
import { FeedbackValidation } from "./feedback.validation";

// Express router
const router = express.Router();

// API Endpoints
router.get(
  "/current-user",
  authGuard(ENUM_USER_ROLES.STUDENT),
  FeedbackController.getCurrentUserFeedback
);

router.get(
  "/:id",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  FeedbackController.getOneById
);

router.get(
  "/",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  FeedbackController.getAllFromDb
);

router.post(
  "/",
  authGuard(ENUM_USER_ROLES.STUDENT),
  validateRequest(FeedbackValidation.create),
  FeedbackController.insertIntoDb
);

router.delete(
  "/:id",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  FeedbackController.deleteOneById
);

export const FeedbackRoutes = router;
