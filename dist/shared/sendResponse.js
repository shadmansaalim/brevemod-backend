"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Function to send API Response ~ Reusable
const sendResponse = (res, data) => {
    // API Response data
    const responseData = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || null,
        meta: data.meta || null,
        data: data.data || null,
    };
    res.status(data.statusCode).json(responseData);
};
exports.default = sendResponse;
