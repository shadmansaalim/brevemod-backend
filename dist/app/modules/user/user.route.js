"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
// Imports
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
// Express router
const router = express_1.default.Router();
// API Endpoints
router.get("/:id", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT, users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.getOneById);
router.get("/", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.getAllFromDb);
router.post("/", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.create), user_controller_1.UserController.insertIntoDb);
router.patch("/:id", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.update), user_controller_1.UserController.updateOneById);
router.delete("/:id", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.deleteOneById);
exports.UserRoutes = router;
