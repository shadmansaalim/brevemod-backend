"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationHelpers = void 0;
// Imports
const pagination_1 = require("../constants/pagination");
// Helper function for Feature Pagination
const calculatePagination = (options) => {
    const page = Number((options === null || options === void 0 ? void 0 : options.page) || pagination_1.PaginationConstants.DEFAULT_PAGE);
    const limit = Number((options === null || options === void 0 ? void 0 : options.limit) || pagination_1.PaginationConstants.DEFAULT_LIMIT);
    const sortBy = options === null || options === void 0 ? void 0 : options.sortBy;
    const sortOrder = options === null || options === void 0 ? void 0 : options.sortOrder;
    // Number of data to skip
    const skip = (page - 1) * limit;
    return {
        page,
        limit,
        sortBy,
        sortOrder,
        skip,
    };
};
exports.PaginationHelpers = { calculatePagination };
