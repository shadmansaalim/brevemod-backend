"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackRoutes = void 0;
// Imports
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const feedback_controller_1 = require("./feedback.controller");
const feedback_validation_1 = require("./feedback.validation");
// Express router
const router = express_1.default.Router();
// API Endpoints
router.get("/current-user", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT), feedback_controller_1.FeedbackController.getCurrentUserFeedback);
router.get("/:id", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), feedback_controller_1.FeedbackController.getOneById);
router.get("/", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), feedback_controller_1.FeedbackController.getAllFromDb);
router.post("/", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.STUDENT), (0, validateRequest_1.default)(feedback_validation_1.FeedbackValidation.create), feedback_controller_1.FeedbackController.insertIntoDb);
router.delete("/:id", (0, authGuard_1.default)(users_1.ENUM_USER_ROLES.ADMIN, users_1.ENUM_USER_ROLES.SUPER_ADMIN), feedback_controller_1.FeedbackController.deleteOneById);
exports.FeedbackRoutes = router;
