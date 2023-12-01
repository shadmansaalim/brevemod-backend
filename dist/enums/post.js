"use strict";
/* eslint-disable no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENUM_POST_FILTERS = exports.ENUM_POST_REACTIONS = void 0;
// Enum Post Reactions
var ENUM_POST_REACTIONS;
(function (ENUM_POST_REACTIONS) {
    ENUM_POST_REACTIONS["LIKE"] = "like";
    ENUM_POST_REACTIONS["LOVE"] = "love";
    ENUM_POST_REACTIONS["ANGRY"] = "angry";
    ENUM_POST_REACTIONS["FUNNY"] = "funny";
})(ENUM_POST_REACTIONS || (exports.ENUM_POST_REACTIONS = ENUM_POST_REACTIONS = {}));
var ENUM_POST_FILTERS;
(function (ENUM_POST_FILTERS) {
    ENUM_POST_FILTERS["PUBLIC_POSTS"] = "public_posts";
    ENUM_POST_FILTERS["ADMIN_POSTS"] = "admin_posts";
    ENUM_POST_FILTERS["MY_POSTS"] = "my_posts";
})(ENUM_POST_FILTERS || (exports.ENUM_POST_FILTERS = ENUM_POST_FILTERS = {}));
