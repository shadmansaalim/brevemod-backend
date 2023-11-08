"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Function to make an object like paginationOptions
const pick = (obj, keys) => {
    // Final Object to return
    const finalObj = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObj[key] = obj[key];
        }
    }
    return finalObj;
};
exports.default = pick;
