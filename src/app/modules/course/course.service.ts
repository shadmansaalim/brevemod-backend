// Imports
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";

import getAllDocuments from "../../../shared/getAllDocuments";
import { ICourse, ICourseFilters } from "./course.interface";
import { Course } from "./course.model";
import { CourseConstants } from "./course.constant";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import mongoose from "mongoose";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { Purchase } from "../purchase/purchase.model";
import { UserCourseRating } from "../userCourseRating/userCourseRating.model";
import { IUserCourseRating } from "../userCourseRating/userCourseRating.interface";

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
  return await Course.findOne({ _id: new Types.ObjectId(id) });
};

const updateOneById = async (
  id: string,
  payload: Partial<ICourse>
): Promise<ICourse | null> => {
  return await Course.findOneAndUpdate(
    { _id: new Types.ObjectId(id) },
    payload,
    {
      new: true,
    }
  );
};

const deleteOneById = async (id: string): Promise<ICourse | null> => {
  // Finding users those who purchased the course
  const studentsOfThisCourse = await Purchase.find({
    courses: { $elemMatch: { $eq: new Types.ObjectId(id) } },
  });

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

    // Removing this course from students purchases
    await Purchase.updateMany(
      { courses: new Types.ObjectId(id) },
      { $pull: { courses: new Types.ObjectId(id) } },
      { multi: true }
    );

    // Removing all the ratings of the course
    await UserCourseRating.deleteMany({ course: new Types.ObjectId(id) });

    // Deleting the course
    deletedCourseData = await Course.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });

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

const addCourseRating = async (
  authUserId: string,
  courseId: string,
  rating: number
): Promise<IUserCourseRating> => {
  // Finding user
  const user = await User.findOne({ _id: authUserId });

  // Throwing error if user does not exists
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  const course = await Course.findOne({ _id: courseId });

  // Throwing error if course does not exists
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course does not exists.");
  }

  const userPurchases = await Purchase.findOne({ user: authUserId });

  // Throwing error if user didn't purchase
  if (!userPurchases || !userPurchases.courses.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have not purchased this course."
    );
  }

  const isCoursePurchasedByUser = (
    userPurchases.courses as Types.ObjectId[]
  ).find((course) => course.equals(courseId));

  // Throwing error if user didn't purchase
  if (!isCoursePurchasedByUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have not purchased this course."
    );
  }

  const userAlreadyReviewed = await UserCourseRating.findOne({
    courseId,
    user: authUserId,
  });

  // Throwing error if user already reviewed this course
  if (userAlreadyReviewed) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already gave your review for this course."
    );
  }

  let newUserRating = null;

  // Mongoose session started
  const session = await mongoose.startSession();

  try {
    // Starting Transaction
    session.startTransaction();

    // Add new review
    newUserRating = await UserCourseRating.create({
      courseId,
      user: authUserId,
      rating,
    });

    // Calculating new avg rating
    const totalRating = course.totalRating + rating;
    const ratingCount = course.ratingCount + 1;
    const avgRating = totalRating / ratingCount;

    // Updating avg rating in course
    await Course.findOneAndUpdate(
      { _id: courseId },
      { totalRating, ratingCount, avgRating }
    );

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

  return newUserRating;
};

export const CourseService = {
  insertIntoDb,
  getAllFromDb,
  getOneById,
  updateOneById,
  deleteOneById,
  addCourseRating,
};
