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
router.post(
  "/",
  authGuard(ENUM_USER_ROLES.STUDENT),
  validateRequest(FeedbackValidation.create),
  FeedbackController.addUserFeedback
);

export const FeedbackRoutes = router;
