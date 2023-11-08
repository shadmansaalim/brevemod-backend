"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserConstants = void 0;
const searchableFields = ["email", "firstName", "middleName", "lastName"];
const filterableFields = ["searchTerm", "_id", "email"];
const fieldsToPopulate = [
    {
        path: "cart",
        populate: [
            {
                path: "courses",
            },
        ],
    },
    {
        path: "purchases",
    },
];
exports.UserConstants = {
    searchableFields,
    filterableFields,
    fieldsToPopulate,
};
