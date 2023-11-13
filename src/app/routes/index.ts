// Imports
import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CourseRoutes } from "../modules/course/course.route";
import { IModuleRoute } from "./route.interface";
import { CartRoutes } from "../modules/cart/cart.route";
import { PurchaseRoutes } from "../modules/purchase/purchase.route";
import { UserRoutes } from "../modules/user/user.route";
import { ProfileRoutes } from "../modules/profile/profile.route";
import { CourseModuleRoutes } from "../modules/courseModule/courseModule.route";
import { UserCourseProgressRoutes } from "../modules/userCourseProgress/userCourseProgress.route";

// Express router
const router = express.Router();

// App Module Routes
const moduleRoutes: IModuleRoute[] = [
  { path: "/auth", route: AuthRoutes },
  { path: "/courses", route: CourseRoutes },
  { path: "/course-modules", route: CourseModuleRoutes },
  { path: "/cart", route: CartRoutes },
  { path: "/purchases", route: PurchaseRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/course-progress", route: UserCourseProgressRoutes },
  { path: "/profile", route: ProfileRoutes },
];

// Application Routes
moduleRoutes.forEach((moduleRoute: IModuleRoute) => {
  router.use(moduleRoute?.path, moduleRoute?.route);
});

export default router;
