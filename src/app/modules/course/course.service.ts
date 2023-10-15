// Imports
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";

import getAllDocuments from "../../../shared/getAllDocuments";
import { ICourse, ICourseFilters } from "./course.interface";
import { Course } from "./course.model";
import { CourseConstants } from "./course.constant";

const insertIntoDb = async (payload: ICourse): Promise<ICourse> => {
  return await Course.create(payload);
};

const getAllFromDb = async (
  filters: ICourseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICourse[]>> => {
  const { page, limit, total, totalPage, result } = await getAllDocuments(
    filters,
    paginationOptions,
    CourseConstants.searchableFields,
    Course
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

const getOneById = async (id: string): Promise<ICourse | null> => {
  return await Course.findOne({ _id: id });
};

const updateOneById = async (
  id: string,
  payload: Partial<ICourse>
): Promise<ICourse | null> => {
  return await Course.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
};

const deleteOneById = async (id: string): Promise<ICourse | null> => {
  return await Course.findOneAndDelete({ _id: id });
};

export const CourseService = {
  insertIntoDb,
  getAllFromDb,
  getOneById,
  updateOneById,
  deleteOneById,
};
