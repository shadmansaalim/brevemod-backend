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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const paginationHelper_1 = require("../helpers/paginationHelper");
const getAllDocuments = (filters, paginationOptions, searchableFields, model, fieldsToPopulate) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructuring ~ Searching and Filtering
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    // Storing all searching and filtering condition in this array
    const searchFilterConditions = [];
    // Checking if SEARCH is requested in GET API - adding find conditions
    if (searchTerm) {
        searchFilterConditions.push({
            $or: searchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Checking if FILTER is requested in GET API - adding find conditions
    if (Object.keys(filterData).length) {
        searchFilterConditions.push({
            $and: Object.entries(filterData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    // Destructuring ~ Pagination and Sorting
    const { page, limit, sortBy, sortOrder, skip } = paginationHelper_1.PaginationHelpers.calculatePagination(paginationOptions);
    // Default Sorting Condition
    const sortingCondition = {};
    // Adding sort condition if requested
    if (sortBy && sortOrder) {
        sortingCondition[sortBy] = sortOrder;
    }
    // Condition for finding documents
    const findConditions = searchFilterConditions.length
        ? { $and: searchFilterConditions }
        : {};
    // Base Query object that stores the query
    const baseQuery = model
        .find(findConditions)
        .sort(sortingCondition)
        .skip(skip)
        .limit(limit);
    // Checking if fields needs to be populated
    if (fieldsToPopulate && fieldsToPopulate.length) {
        // Chain the populate calls for each field
        fieldsToPopulate.forEach((field) => {
            baseQuery.populate(field);
        });
    }
    // Documents
    const result = yield baseQuery.exec();
    // Total Documents in Database matching the condition
    const total = yield model.countDocuments(findConditions);
    // Total page count
    const totalPage = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPage,
        result,
    };
});
exports.default = getAllDocuments;
