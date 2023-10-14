// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import { PurchaseController } from "./purchase.controller";

// Express router
const router = express.Router();

// API Endpoints
router.post(
  "/",
  authGuard(ENUM_USER_ROLES.STUDENT),
  PurchaseController.purchaseCourse
);

export const PurchaseRoutes = router;
