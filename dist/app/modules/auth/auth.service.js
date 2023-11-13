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
exports.AuthService = void 0;
const user_model_1 = require("../user/user.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const users_1 = require("../../../enums/users");
const user_service_1 = require("../user/user.service");
// Sign up user function
const signUpUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Set user role by default its STUDENT for everyone who signs up
    payload.role = users_1.ENUM_USER_ROLES.STUDENT;
    yield user_service_1.UserService.insertIntoDb(payload);
});
// LOGIN user function
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructuring id and password
    const { email, password: loginPassword } = payload;
    // Checking whether user exists or not
    const userExists = yield user_model_1.User.exists(email);
    // Throwing error if user does not exists
    if (!userExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    // Destructuring
    const { _id: id, role, password } = userExists;
    // Comparing Password
    const isPasswordMatched = yield user_model_1.User.isPasswordMatched(loginPassword, password);
    // Throwing error if password does not matches
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect Password.");
    }
    // Create access token
    const accessToken = jwtHelper_1.JwtHelpers.createToken({ id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // Create refresh token
    const refreshToken = jwtHelper_1.JwtHelpers.createToken({ id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    const user = yield user_model_1.User.findOne({ _id: id });
    // Throwing error
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Failed to retrieve user data.");
    }
    return {
        accessToken,
        refreshToken,
        user,
    };
});
// Refresh token function
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    // Verify given token
    try {
        verifiedToken = jwtHelper_1.JwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Invalid Refresh Token.");
    }
    // Destructuring
    const { id, role } = verifiedToken;
    // Checking whether user exists or not as sometimes deleted user might try to access using refresh token.
    const userExists = yield user_model_1.User.exists(id);
    // Throwing error if user does not exists
    if (!userExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    // Generate new access token
    const newAccessToken = jwtHelper_1.JwtHelpers.createToken({ id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
// Change Password function
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructuring old and new password
    const { oldPassword, newPassword } = payload;
    // Checking whether user exists or not
    const userExists = yield user_model_1.User.findOne({ id: user === null || user === void 0 ? void 0 : user.id }).select("+password");
    // Throwing error if user does not exists
    if (!userExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    // Checking given old password is correct or not
    const isPasswordMatched = yield user_model_1.User.isPasswordMatched(oldPassword, userExists.password);
    // Throwing error if password does not matches
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect Password.");
    }
    // Set Updated data
    userExists.password = newPassword;
    // Updating document using save
    userExists.save();
});
exports.AuthService = {
    signUpUser,
    loginUser,
    refreshToken,
    changePassword,
};
