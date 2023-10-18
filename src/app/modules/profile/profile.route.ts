// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "../user/user.validation";
import { ProfileController } from "./profile.controller";
import { ProfileValidation } from "./profile.validation";

// Express router
const router = express.Router();

// API Endpoints
router.get(
  "/",
  authGuard(
    ENUM_USER_ROLES.STUDENT,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.SUPER_ADMIN
  ),
  ProfileController.getOneById
);

router.patch(
  "/",
  authGuard(
    ENUM_USER_ROLES.STUDENT,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.SUPER_ADMIN
  ),
  validateRequest(ProfileValidation.update),
  ProfileController.updateOneById
);

router.delete(
  "/",
  authGuard(
    ENUM_USER_ROLES.STUDENT,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.SUPER_ADMIN
  ),
  ProfileController.deleteOneById
);

export const ProfileRoutes = router;
