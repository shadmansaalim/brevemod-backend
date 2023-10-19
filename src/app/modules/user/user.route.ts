// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

// Express router
const router = express.Router();

// API Endpoints
router.get(
  "/:id",
  authGuard(
    ENUM_USER_ROLES.STUDENT,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.SUPER_ADMIN
  ),
  UserController.getOneById
);

router.get(
  "/",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  UserController.getAllFromDb
);

router.post(
  "/",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(UserValidation.create),
  UserController.insertIntoDb
);

router.patch(
  "/:id",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(UserValidation.update),
  UserController.updateOneById
);

router.delete(
  "/:id",
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  UserController.deleteOneById
);

export const UserRoutes = router;
