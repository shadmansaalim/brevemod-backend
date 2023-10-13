// Imports
import express from "express";
import { ENUM_USER_ROLES } from "../../../enums/users";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { CourseController } from "./course.controller";
import { CourseValidation } from "./course.validation";

// Express router
const router = express.Router();

// API Endpoints
router.get("/:id", CourseController.getOneById);

router.get("/", CourseController.getAllFromDb);

router.post(
  "/",
  validateRequest(CourseValidation.create),
  CourseController.insertIntoDb
);

router.patch(
  "/:id",
  validateRequest(CourseValidation.update),
  CourseController.updateOneById
);

router.delete("/:id", CourseController.deleteOneById);

export const CourseRoutes = router;
