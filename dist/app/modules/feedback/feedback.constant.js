"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackConstants = void 0;
const searchableFields = [];
const filterableFields = ["searchTerm", "user"];
const fieldsToPopulate = [
    {
        path: "user",
        select: "_id firstName middleName lastName email",
    },
];
exports.FeedbackConstants = {
    searchableFields,
    filterableFields,
    fieldsToPopulate,
};
