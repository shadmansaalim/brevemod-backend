"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseRoutes = void 0;
// Imports
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const purchase_controller_1 = require("./purchase.controller");
// Express router
const router = express_1.default.Router();
// API Endpoints
router.post("/create-payment-intent", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT), purchase_controller_1.PurchaseController.createPaymentIntent);
router.post("/", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT), purchase_controller_1.PurchaseController.purchaseCourse);
router.delete("/cancel-enrollment/:courseId", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT), purchase_controller_1.PurchaseController.cancelEnrollment);
exports.PurchaseRoutes = router;
