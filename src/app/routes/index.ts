// Imports
import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CourseRoutes } from "../modules/course/course.route";
import { IModuleRoute } from "./route.interface";
import { CartRoutes } from "../modules/cart/cart.route";
import { PurchaseRoutes } from "../modules/purchase/purchase.route";

// Express router
const router = express.Router();

// App Module Routes
const moduleRoutes: IModuleRoute[] = [
  { path: "/auth", route: AuthRoutes },
  { path: "/courses", route: CourseRoutes },
  { path: "/cart", route: CartRoutes },
  { path: "/purchases", route: PurchaseRoutes },
];

// Application Routes
moduleRoutes.forEach((moduleRoute: IModuleRoute) => {
  router.use(moduleRoute?.path, moduleRoute?.route);
});

export default router;
