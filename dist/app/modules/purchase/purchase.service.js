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
const cart_model_1 = require("../cart/cart.model");
const purchase_model_1 = require("./purchase.model");
const mongoose_1 = __importDefault(require("mongoose"));
const getMyCourses = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding user
    const user = yield user_model_1.User.findOne({ _id: authUserId });
    // Throwing error if user does not exists
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    // Finding User Purchases
    const userPurchases = yield purchase_model_1.Purchase.findOne({ user: authUserId }).populate("courses");
    // Throwing error if user does not exists
    if (!userPurchases) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "You have no purchased courses.");
    }
    const myCourses = userPurchases.courses;
    return myCourses;
});
const getIsCoursePurchased = (authUserId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding user
    const user = yield user_model_1.User.findOne({ _id: authUserId });
    // Throwing error if user does not exists
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    const course = yield course_model_1.Course.findOne({ _id: courseId });
    // Throwing error if course does not exists
    if (!course) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course does not exists.");
    }
    // Finding is course purchased
    const isPurchased = yield purchase_model_1.Purchase.findOne({
        user: authUserId,
        courses: { $elemMatch: { $eq: courseId } },
    });
    if (isPurchased) {
        return true;
    }
    else {
        return false;
    }
});
const createPaymentIntent = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding user cart
    const cart = yield cart_model_1.Cart.findOne({ user: authUserId });
    // Throwing error if user cart does not exists
    if (!cart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User cart does not exists.");
    }
    if (!cart.courses.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cart is empty nothing to pay for.");
    }
    // Getting the payment amount for stripe purchasing course
    const amount = paymentHelper_1.PaymentHelpers.getPaymentAmountForStripe(Math.round(cart.payment.grandTotal));
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
    // Finding cart
    const cart = yield cart_model_1.Cart.findOne({ user: authUserId });
    // Throwing error if user cart does not exists
    if (!cart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User cart does not exists.");
    }
    if (!cart.courses.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `You have nothing in your cart to purchase`);
    }
    // Finding User Purchases
    const userPurchases = yield purchase_model_1.Purchase.findOne({ user: authUserId });
    if (userPurchases) {
        // Check if course already purchased
        const checkAlreadyPurchased = cart.courses.filter((id) => userPurchases.courses.includes(id));
        // Throwing error if user tries to purchase a course which he/she did already
        if (checkAlreadyPurchased.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `You cannot purchase a course that you already purchased once.`);
        }
    }
    let newPurchaseData = null;
    // Mongoose session started
    const session = yield mongoose_1.default.startSession();
    try {
        // Starting Transaction
        session.startTransaction();
        if (userPurchases) {
            // Adding courses to purchase list
            userPurchases.courses = [
                ...cart.courses,
                ...userPurchases.courses,
            ];
            newPurchaseData = yield purchase_model_1.Purchase.findOneAndUpdate({ user: authUserId }, userPurchases, {
                new: true,
            });
        }
        else {
            newPurchaseData = yield purchase_model_1.Purchase.create({
                user: authUserId,
                courses: [...cart.courses],
            });
        }
        // Throwing error if fails to update purchase data
        if (!newPurchaseData) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Failed to purchase courses.`);
        }
        // Resetting user cart
        const userUpdatedCart = {
            user: authUserId,
            courses: [],
            payment: {
                subTotal: 0.0,
                tax: 0.0,
                grandTotal: 0.0,
            },
        };
        const resetCart = yield cart_model_1.Cart.findOneAndUpdate({ user: authUserId }, userUpdatedCart, {
            new: true,
        });
        // Throwing error if fails
        if (!resetCart) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Failed to purchase courses.`);
        }
        const newPurchaseDataCourses = newPurchaseData.courses;
        // Updating student count for each courses
        for (const courseId of newPurchaseDataCourses) {
            const purchasingCourse = yield course_model_1.Course.findOne({
                _id: courseId,
            });
            // Throwing error if course not found
            if (!purchasingCourse) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Course does not exist.`);
            }
            const studentsCount = purchasingCourse.studentsCount + 1;
            const updateCourse = yield course_model_1.Course.findOneAndUpdate({
                _id: courseId,
            }, { studentsCount });
            // Throwing error update fails
            if (!updateCourse) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Something went wrong.`);
            }
        }
        // Committing Transaction
        yield session.commitTransaction();
        // Ending Session
        yield session.endSession();
    }
    catch (error) {
        // Aborting Transaction because of error
        yield session.abortTransaction();
        // Ending Session because of error
        yield session.endSession();
        // Throwing error
        throw error;
    }
    return newPurchaseData;
});
exports.PurchaseService = {
    getMyCourses,
    getIsCoursePurchased,
    createPaymentIntent,
    purchaseCourse,
};
