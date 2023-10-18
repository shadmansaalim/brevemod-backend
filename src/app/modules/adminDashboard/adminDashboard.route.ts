// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import { AdminDashboardController } from "./adminDashboard.controller";

// Express router
const router = express.Router();

// API Endpoints
router.get(
  "/",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  AdminDashboardController.getAdminDashboardData
);

export const AdminDashboardRoutes = router;
