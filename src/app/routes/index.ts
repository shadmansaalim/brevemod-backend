// Imports
import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CourseRoutes } from "../modules/course/course.route";
import { IModuleRoute } from "./route.interface";

// Express router
const router = express.Router();

// App Module Routes
const moduleRoutes: IModuleRoute[] = [
  { path: "/auth", route: AuthRoutes },
  { path: "/courses", route: CourseRoutes },
];

// Application Routes
moduleRoutes.forEach((moduleRoute: IModuleRoute) => {
  router.use(moduleRoute?.path, moduleRoute?.route);
});

export default router;
