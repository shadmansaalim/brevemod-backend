// Imports
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";

import getAllDocuments from "../../../shared/getAllDocuments";
import { ICourse, ICourseFilters } from "./course.interface";
import { Course } from "./course.model";
import { CourseConstants } from "./course.constant";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { mongoose } from "mongoose";
import { CourseReview } from "../courseReview/courseReview.model";

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
  // return await Course.findOneAndDelete({ _id: id });

  // Finding users those who purchased the course
  const studentsOfThisCourse = await User.find(
    { purchases: { $elemMatch: { $eq: new Types.ObjectId(id) } } },
    { _id: 1 }
  );

  // Deleting the course if no students enrolled in this course
  if (!studentsOfThisCourse) {
    return await Course.findOneAndDelete({ _id: id });
  }

  let deletedCourseData = null;

  // Mongoose session started
  const session = await mongoose.startSession();

  try {
    // Starting Transaction
    session.startTransaction();

    // Removing this course from students purchases field
    await User.updateMany(
      { purchases: new Types.ObjectId(id) },
      { $pull: { purchases: new Types.ObjectId(id) } },
      { multi: true }
    );

    // Removing all the reviews of the course
    await CourseReview.deleteMany({ course: new Types.ObjectId(id) });

    // Deleting the course
    deletedCourseData = await Course.findOneAndDelete({ _id: id });

    // Committing Transaction
    await session.commitTransaction();

    // Ending Session
    await session.endSession();
  } catch (error) {
    // Aborting Transaction because of error
    await session.abortTransaction();
    // Ending Session because of error
    await session.endSession();

    // Throwing error
    throw error;
  }

  return deletedCourseData;
};

export const CourseService = {
  insertIntoDb,
  getAllFromDb,
  getOneById,
  updateOneById,
  deleteOneById,
};
