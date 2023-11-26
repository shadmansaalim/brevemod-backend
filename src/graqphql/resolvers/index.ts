// Imports
import { Mutation } from "./Mutation/Mutation";
import { Query } from "./Query/Query";
import { PostAuthorRelation } from "./relation";

export const resolvers = {
  Query,
  Post: PostAuthorRelation,
  Mutation,
};
