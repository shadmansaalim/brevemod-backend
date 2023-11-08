"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardRoutes = void 0;
// Imports
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const adminDashboard_controller_1 = require("./adminDashboard.controller");
// Express router
const router = express_1.default.Router();
// API Endpoints
router.get("/", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), adminDashboard_controller_1.AdminDashboardController.getAdminDashboardData);
exports.AdminDashboardRoutes = router;
