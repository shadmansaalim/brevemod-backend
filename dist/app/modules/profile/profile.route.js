"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRoutes = void 0;
// Imports
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const profile_controller_1 = require("./profile.controller");
const profile_validation_1 = require("./profile.validation");
// Express router
const router = express_1.default.Router();
// API Endpoints
router.get("/", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT, users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), profile_controller_1.ProfileController.getOneById);
router.patch("/", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT, users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(profile_validation_1.ProfileValidation.update), profile_controller_1.ProfileController.updateOneById);
router.delete("/", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT, users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), profile_controller_1.ProfileController.deleteOneById);
exports.ProfileRoutes = router;
