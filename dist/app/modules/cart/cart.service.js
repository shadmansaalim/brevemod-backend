"use strict";
// Imports
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const course_model_1 = require("../course/course.model");
const common_1 = require("../../../constants/common");
const addToCart = (authUserId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Finding user
    const user = yield user_model_1.User.findOne({ _id: authUserId })
        .populate({
        path: "cart",
        populate: [
            {
                path: "courses",
            },
        ],
    })
        .populate({
        path: "purchases",
    });
    // Throwing error if user does not exists
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    const course = yield course_model_1.Course.findOne({ _id: courseId });
    // Throwing error if course does not exists
    if (!course) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course does not exists.");
    }
    // User Cart
    const cart = user.cart;
    const courseAlreadyInCart = cart.courses.find((course) => course._id.equals(courseId));
    if (courseAlreadyInCart) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Course already added in cart.");
    }
    // Finding course in user purchases
    const checkAlreadyPurchased = user.purchases.find((course) => course._id.equals(courseId));
    // Throwing error if user tries to purchase a course which he/she did already
    if (checkAlreadyPurchased) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `You cannot add a course to cart that you already purchased once.`);
    }
    // Storing new cart data
    cart.courses = [course, ...cart.courses];
    // Adding course price to subtotal
    cart.payment.subTotal += course.price;
    // Calculating tax
    cart.payment.tax =
        ((_a = cart.payment) === null || _a === void 0 ? void 0 : _a.subTotal) * common_1.tax_course_purchase - ((_b = cart.payment) === null || _b === void 0 ? void 0 : _b.subTotal);
    // Calculating grand total
    cart.payment.grandTotal = cart.payment.subTotal + cart.payment.tax;
    return yield user_model_1.User.findOneAndUpdate({ _id: authUserId }, { cart }, {
        new: true,
    })
        .populate({
        path: "cart",
        populate: [
            {
                path: "courses",
            },
        ],
    })
        .populate({
        path: "purchases",
    });
});
const removeFromCart = (authUserId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    // Finding user
    const user = yield user_model_1.User.findOne({ _id: authUserId })
        .populate({
        path: "cart",
        populate: [
            {
                path: "courses",
            },
        ],
    })
        .populate({
        path: "purchases",
    });
    // Throwing error if user does not exists
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    const course = yield course_model_1.Course.findOne({ _id: courseId });
    // Throwing error if course does not exists
    if (!course) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course does not exists.");
    }
    // User Cart
    const cart = user.cart;
    const courseExistsInCart = cart.courses.find((course) => course._id.equals(courseId));
    if (!courseExistsInCart) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Course is not in cart so nothing to remove.");
    }
    // Const new courses in cart
    const newCourses = cart.courses.filter((course) => !course._id.equals(courseId));
    // Removing course price from subtotal
    cart.payment.subTotal -= course.price;
    // Calculating tax
    cart.payment.tax =
        ((_c = cart.payment) === null || _c === void 0 ? void 0 : _c.subTotal) * common_1.tax_course_purchase - ((_d = cart.payment) === null || _d === void 0 ? void 0 : _d.subTotal);
    // Calculating grand total
    cart.payment.grandTotal = cart.payment.subTotal + cart.payment.tax;
    // Storing new cart data
    cart.courses = [...newCourses];
    return yield user_model_1.User.findOneAndUpdate({ _id: authUserId }, { cart }, {
        new: true,
    })
        .populate({
        path: "cart",
        populate: [
            {
                path: "courses",
            },
        ],
    })
        .populate({
        path: "purchases",
    });
});
exports.CartService = {
    addToCart,
    removeFromCart,
};
