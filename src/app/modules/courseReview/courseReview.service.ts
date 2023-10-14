// Imports
import { CourseReview } from "./courseReview.model";
import mongoose from "mongoose";
import { User } from "../user/user.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { Course } from "../course/course.model";
import { ICourseReview } from "./courseReview.interface";

const addReviewToCourse = async (
  courseId: string,
  authUserId: string,
  payload: {
    rating: number;
    words: string;
  }
): Promise<ICourseReview> => {
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

  let newReviewData = null;

  // Mongoose session started
  const session = await mongoose.startSession();

  try {
    // Starting Transaction
    session.startTransaction();

    // Add new review
    newReviewData = await CourseReview.create({
      courseId,
      userId: authUserId,
      ...payload,
    });

    // Calculating new avg rating
    const totalRating = course.totalRating + payload.rating;
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

  return newReviewData;
};

// const getOneById = async (id: string): Promise<ICourse | null> => {
//   return await Course.findOne({ _id: id });
// };

export const CourseReviewService = {
  addReviewToCourse,
};
