// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import { PurchaseController } from "./purchase.controller";

// Express router
const router = express.Router();

// API Endpoints

router.get(
  "/my-courses",
  authGuard(ENUM_USER_ROLES.STUDENT),
  PurchaseController.getMyCourses
);

router.get(
  "/status/:courseId",
  authGuard(ENUM_USER_ROLES.STUDENT),
  PurchaseController.getIsCoursePurchased
);

router.post(
  "/create-payment-intent",
  authGuard(ENUM_USER_ROLES.STUDENT),
  PurchaseController.createPaymentIntent
);

router.post(
  "/",
  authGuard(ENUM_USER_ROLES.STUDENT),
  PurchaseController.purchaseCourse
);

router.delete(
  "/cancel-enrollment/:courseId",
  authGuard(ENUM_USER_ROLES.STUDENT),
  PurchaseController.cancelEnrollment
);

export const PurchaseRoutes = router;
