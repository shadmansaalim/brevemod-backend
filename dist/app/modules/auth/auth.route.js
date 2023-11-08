"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
// Imports
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
// Express router
const router = express_1.default.Router();
// API Endpoints
router.post("/signup", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.signUpZodSchema), auth_controller_1.AuthController.signUpUser);
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginZodSchema), auth_controller_1.AuthController.loginUser);
router.post("/refresh-token", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenZodSchema), auth_controller_1.AuthController.refreshToken);
router.post("/change-password", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.changePasswordZodSchema), (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.SUPER_ADMIN, users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.STUDENT), auth_controller_1.AuthController.changePassword);
exports.AuthRoutes = router;
