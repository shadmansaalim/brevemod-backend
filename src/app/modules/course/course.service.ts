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
import { openai } from "../../../helpers/openRouter";
import { extractJsonFromMessage } from "../../../helpers/extractJsonFromMessage";
import { withApiKeyFallback } from "../../../helpers/withApiKeyFallback";

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
  // Checking if any user purchased this course
  const anyPurchase = await Purchase.findOne({
    courses: { $elemMatch: { $eq: new Types.ObjectId(id) } },
  });

  // Throwing error if admin tries to delete a course where students are enrolled
  if (anyPurchase) {
    throw new ApiError(
      httpStatus.NOT_ACCEPTABLE,
      "There are students who purchased this course for which we cannot remove it from our system."
    );
  }

  return await Course.findOneAndDelete({ _id: id });
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

const getUserCourseRating = async (
  authUserId: string,
  courseId: string
): Promise<IUserCourseRating | null> => {
  return await UserCourseRating.findOne({ courseId, user: authUserId });
};

// This will give suggestions to the user which courses to do for the given job description
const getAISuggestions = async (payload: { jobDescription: string }) => {
  if (!(payload && payload?.jobDescription)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You need to pass the job description for which you want AI suggestions."
    );
  }

  const extractKeywords = async (jobDescription: string): Promise<string> => {
    const completion = await withApiKeyFallback((client) =>
      client.chat.completions.create({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [
          {
            role: "system",
            content: "You are a keyword extraction assistant.",
          },
          {
            role: "user",
            content: `Extract a maximum of 5 most important technical skills or tools from the following job description.
  Return ONLY a comma-separated list of keywords, nothing else. No explanation, no bullet points, no markdown.
  
  Job Description:
  ${jobDescription}`,
          },
        ],
      })
    );

    return completion.choices[0].message?.content?.trim() ?? jobDescription;
  };

  // Get all courses
  const courses = await Course.find({});

  if (!courses.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "No courses available.");
  }

  const keywords = await extractKeywords(payload.jobDescription);

  if (!keywords) {
    throw new ApiError(httpStatus.NOT_FOUND, "Something went wrong");
  }

  // Format courses for the prompt
  const courseList = courses
    .map(
      (course, index) =>
        `${index + 1}. ID: ${course._id}
     Title: ${course.title}
     Description: ${course.description}`
    )
    .join("\n\n");

  const prompt = `You are a career advisor. Based on the required skills and keywords below, recommend the most relevant courses.
  
  Required Skills & Keywords: ${keywords}
  
  Available Courses: ${courseList}
  
  Instructions:
  - Select a maximum of 3 most relevant courses only.
  - Return ONLY a JSON array, no markdown, no explanation:
  
  [
    {
      "courseId": "<course _id>",
      "reason": "<why this course matches the required skills>"
    }
  ]`;

  const completion = await withApiKeyFallback((client) =>
    client.chat.completions.create({
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      messages: [
        {
          role: "system",
          content:
            "You are a career advisor that provides courses suggestions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    })
  );

  const suggestions: { courseId: Types.ObjectId; reason: string }[] =
    await extractJsonFromMessage(completion.choices[0].message);

  const suggestionsReasonMap = new Map(
    suggestions.map((s) => [String(s.courseId), s.reason])
  );

  const suggestedCourseIds = new Set(
    suggestions.map((s) => String(s.courseId))
  );

  const result = courses
    .filter((course) => suggestedCourseIds.has(String(course._id)))
    .map((course) => {
      const courseObj =
        typeof course.toObject === "function" ? course.toObject() : course;

      return {
        ...courseObj,
        reason: suggestionsReasonMap.get(String(course._id)),
      };
    });

  return result;
};

export const CourseService = {
  insertIntoDb,
  getAllFromDb,
  getOneById,
  updateOneById,
  deleteOneById,
  addCourseRating,
  getUserCourseRating,
  getAISuggestions,
};
