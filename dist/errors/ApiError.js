"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Custom Error class for sending API errors
class ApiError extends Error {
    constructor(statusCode, message, stack = '') {
        super(message);
        this.stack = '';
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = ApiError;
