"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
// Imports
const Mutation_1 = require("./Mutation/Mutation");
const Query_1 = require("./Query/Query");
const relation_1 = require("./relation");
exports.resolvers = {
    Query: Query_1.Query,
    Post: relation_1.PostAuthorRelation,
    Mutation: Mutation_1.Mutation,
};
