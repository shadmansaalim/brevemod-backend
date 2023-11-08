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
exports.PurchaseService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const paymentHelper_1 = require("../../../helpers/paymentHelper");
const common_1 = require("../../../constants/common");
const course_model_1 = require("../course/course.model");
const createPaymentIntent = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (!user.cart.courses.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cart is empty nothing to pay for.");
    }
    // Getting the payment amount for stripe purchasing course
    const amount = paymentHelper_1.PaymentHelpers.getPaymentAmountForStripe(user.cart.payment.grandTotal);
    //Creating Payment intent
    const paymentIntent = yield paymentHelper_1.PaymentHelpers.stripe.paymentIntents.create({
        currency: common_1.currency,
        amount,
        payment_method_types: common_1.payment_method_types,
    });
    return {
        clientSecret: paymentIntent.client_secret,
    };
});
// Function to purchase course
const purchaseCourse = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
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
    // User Cart
    const cart = user.cart;
    if (!cart.courses.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `You have nothing in your cart to purchase`);
    }
    // Extract "_id" values from the objects in each array
    const cartCoursesIds = cart.courses.map((obj) => obj._id.toString());
    const purchaseCoursesIds = user.purchases.map((obj) => obj._id.toString());
    // Check if there are common "_id" values between the two arrays
    const checkAlreadyPurchased = cartCoursesIds.filter((id) => purchaseCoursesIds.includes(id));
    // Throwing error if user tries to purchase a course which he/she did already
    if (checkAlreadyPurchased.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `You cannot purchase a course that you already purchased once.`);
    }
    // Updated data, resetting cart and adding purchases data
    const updatedData = {
        cart: {
            courses: [],
            payment: {
                subTotal: 0.0,
                tax: 0.0,
                grandTotal: 0.0,
            },
        },
        purchases: [...cart.courses, ...user.purchases],
    };
    // Updating user purchases data
    return yield user_model_1.User.findOneAndUpdate({ _id: authUserId }, updatedData, {
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
// Function to cancel user course enrollment
const cancelEnrollment = (authUserId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
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
    // User purchases
    const purchases = user.purchases;
    const isPurchased = purchases.find((course) => course._id.equals(courseId));
    // Throwing error if user didn't purchase the course which he is trying to cancel
    if (!isPurchased) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `You didn't purchase the course that you are trying to cancel.`);
    }
    // Removing the course from purchases
    const newPurchases = purchases.filter((course) => !course._id.equals(courseId));
    // Updated data
    const updatedData = {
        purchases: [...newPurchases],
    };
    // Updating user purchases data
    return yield user_model_1.User.findOneAndUpdate({ _id: authUserId }, updatedData, {
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
exports.PurchaseService = {
    createPaymentIntent,
    purchaseCourse,
    cancelEnrollment,
};
