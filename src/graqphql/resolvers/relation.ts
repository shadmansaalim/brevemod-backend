// Imports
import { Context } from "../../interfaces/common";
import { userLoader } from "../dataLoaders/userLoader";

export const PostAuthorRelation = {
  author: async (parent: any, args: any, context: Context) => {
    const { authorId } = parent;
    return await userLoader.load(authorId);
  },
};
