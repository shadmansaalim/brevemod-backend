"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoutes = void 0;
// Imports
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const cart_controller_1 = require("./cart.controller");
// Express router
const router = express_1.default.Router();
// API Endpoints
router.patch("/add-to-cart/:courseId", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT), cart_controller_1.CartController.addToCart);
router.patch("/remove-from-cart/:courseId", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT), cart_controller_1.CartController.removeFromCart);
exports.CartRoutes = router;
