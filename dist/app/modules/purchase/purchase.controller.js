"use strict";
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
exports.PurchaseController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const purchase_service_1 = require("./purchase.service");
const getMyCourses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting authenticated user from request
    const user = req.user;
    const result = yield purchase_service_1.PurchaseService.getMyCourses(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My courses retrieved successfully.",
        data: result,
    });
}));
const getIsCoursePurchased = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting authenticated user from request
    const user = req.user;
    const { courseId } = req.params;
    const result = yield purchase_service_1.PurchaseService.getIsCoursePurchased(user.id, courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course purchase status retrieved successfully.",
        data: result,
    });
}));
const createPaymentIntent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting authenticated user from request
    const user = req.user;
    const result = yield purchase_service_1.PurchaseService.createPaymentIntent(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment intent created successfully.",
        data: result,
    });
}));
const purchaseCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting authenticated user from request
    const user = req.user;
    const result = yield purchase_service_1.PurchaseService.purchaseCourse(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Courses purchased successfully.",
        data: result,
    });
}));
exports.PurchaseController = {
    getIsCoursePurchased,
    getMyCourses,
    createPaymentIntent,
    purchaseCourse,
};
