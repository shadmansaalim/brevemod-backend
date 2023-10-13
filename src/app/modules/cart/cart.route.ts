// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import { CartController } from "./cart.controller";

// Express router
const router = express.Router();

// API Endpoints
router.patch(
  "/add-to-cart/:courseId",
  authGuard(ENUM_USER_ROLES.STUDENT),
  CartController.addToCart
);

router.patch(
  "/remove-from-cart/:courseId",
  authGuard(ENUM_USER_ROLES.STUDENT),
  CartController.removeFromCart
);

export const CartRoutes = router;
