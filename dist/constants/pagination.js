"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationConstants = void 0;
// Pagination  Fields
const fields = ["page", "limit", "sortBy", "sortOrder"];
// Pagination Defaults
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 8;
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_ORDER = "desc";
exports.PaginationConstants = {
    fields,
    DEFAULT_PAGE,
    DEFAULT_LIMIT,
    DEFAULT_SORT_BY,
    DEFAULT_SORT_ORDER,
};
