// Imports
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import getAllDocuments from "../../../shared/getAllDocuments";
import { FeedbackConstants } from "./feedback.constant";
import { IFeedback, IFeedbackFilters } from "./feedback.interface";
import { Feedback } from "./feedback.model";
import { Types } from "mongoose";

const insertIntoDb = async (
  authUserId: string,
  payload: IFeedback
): Promise<IFeedback> => {
  payload.user = new Types.ObjectId(authUserId);
  return await Feedback.create(payload);
};

const getAllFromDb = async (
  filters: IFeedbackFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFeedback[]>> => {
  const { page, limit, total, totalPage, result } = await getAllDocuments(
    filters,
    paginationOptions,
    FeedbackConstants.searchableFields,
    Feedback,
    FeedbackConstants.fieldsToPopulate
  );

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

const getOneById = async (id: string): Promise<IFeedback | null> => {
  return await Feedback.findOne({ _id: id });
};

const deleteOneById = async (id: string): Promise<IFeedback | null> => {
  return await Feedback.findOneAndDelete({ _id: id });
};

export const FeedbackService = {
  insertIntoDb,
  getAllFromDb,
  getOneById,
  deleteOneById,
};
