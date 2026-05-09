"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const course_route_1 = require("../modules/course/course.route");
const cart_route_1 = require("../modules/cart/cart.route");
const purchase_route_1 = require("../modules/purchase/purchase.route");
const user_route_1 = require("../modules/user/user.route");
const profile_route_1 = require("../modules/profile/profile.route");
const courseModule_route_1 = require("../modules/courseModule/courseModule.route");
const userCourseProgress_route_1 = require("../modules/userCourseProgress/userCourseProgress.route");
// Express router
const router = express_1.default.Router();
// App Module Routes
const moduleRoutes = [
    { path: "/auth", route: auth_route_1.AuthRoutes },
    { path: "/courses", route: course_route_1.CourseRoutes },
    { path: "/course-modules", route: courseModule_route_1.CourseModuleRoutes },
    { path: "/cart", route: cart_route_1.CartRoutes },
    { path: "/purchases", route: purchase_route_1.PurchaseRoutes },
    { path: "/users", route: user_route_1.UserRoutes },
    { path: "/course-progress", route: userCourseProgress_route_1.UserCourseProgressRoutes },
    { path: "/profile", route: profile_route_1.ProfileRoutes },
];
// Application Routes
moduleRoutes.forEach((moduleRoute) => {
    router.use(moduleRoute === null || moduleRoute === void 0 ? void 0 : moduleRoute.path, moduleRoute === null || moduleRoute === void 0 ? void 0 : moduleRoute.route);
});
exports.default = router;
