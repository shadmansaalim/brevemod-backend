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
import { extractJsonFromMessage } from "../../../helpers/extractJsonFromMessage";
import { withApiKeyFallback } from "../../../helpers/withApiKeyFallback";

// Types
type AISuggestion = {
  courseId: Types.ObjectId;
  reason: string;
};

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
const FREE_MODELS = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "z-ai/glm-4.5-air:free",
  "poolside/laguna-m.1:free",
  "openai/gpt-oss-120b:free",
];

const getAISuggestions = async (payload: { jobDescription: string }) => {
  try {
    // Validate payload
    if (!payload || !payload.jobDescription?.trim()) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You need to pass the job description for which you want AI suggestions."
      );
    }

    // Get all courses
    const courses = await Course.find({}).lean();

    if (!courses.length) {
      throw new ApiError(httpStatus.NOT_FOUND, "No courses available.");
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

    const prompt = `You are a career advisor. Based on the job description below, recommend the most relevant courses from the provided list.

Job Description: ${payload.jobDescription}

Available Courses:
${courseList}

Instructions:
- Analyze the skills and requirements in the job description.
- Select a maximum of 3 most relevant courses only.
- Return your response as a JSON array using this exact structure:

[
  {
    "courseId": "<course _id>",
    "reason": "<why this course is relevant to the job description>"
  }
]`;

    let completion: any = null;
    let lastError: any = null;

    // Try models one by one if 504 occurs
    for (const model of FREE_MODELS) {
      try {
        console.log(`Trying AI model: ${model}`);

        completion = await withApiKeyFallback((client) =>
          client.chat.completions.create({
            model,
            messages: [
              {
                role: "system",
                content:
                  "You are a career advisor that provides course suggestions.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          })
        );

        // Success → break loop
        console.log(`SUCCESS WITH MODEL: ${model}`);
        break;
      } catch (error: any) {
        console.error(`MODEL FAILED: ${model}`, error);

        lastError = error;

        // If 504 → try next model
        if (error?.status === 504) {
          console.log("504 detected. Trying next model...");
          continue;
        }

        // If not 504 → immediately throw
        throw error;
      }
    }

    // If no model succeeded
    if (!completion) {
      throw lastError || new Error("All AI models failed.");
    }

    // Validate AI response
    const aiMessage = completion?.choices?.[0]?.message;

    if (!aiMessage) {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        "AI returned an empty response."
      );
    }

    // Parse JSON response
    const suggestions: AISuggestion[] = extractJsonFromMessage(aiMessage);

    if (!Array.isArray(suggestions)) {
      throw new ApiError(httpStatus.BAD_GATEWAY, "Invalid AI response format.");
    }

    if (!suggestions.length) {
      throw new ApiError(httpStatus.NOT_FOUND, "No course suggestions found.");
    }

    // Filter invalid AI data
    const validSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion?.courseId &&
        mongoose.Types.ObjectId.isValid(suggestion.courseId) &&
        suggestion?.reason
    );

    if (!validSuggestions.length) {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        "AI returned invalid course suggestions."
      );
    }

    // Create maps
    const suggestionsReasonMap = new Map(
      validSuggestions.map((s) => [String(s.courseId), s.reason])
    );

    const suggestedCourseIds = new Set(
      validSuggestions.map((s) => String(s.courseId))
    );

    // Build final result
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

    if (!result.length) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "No matching courses found from AI suggestions."
      );
    }

    return result;
  } catch (error: any) {
    console.error("GET AI SUGGESTIONS ERROR:", error);

    // Already handled custom error
    if (error instanceof ApiError) {
      throw error;
    }

    // MongoDB / Mongoose errors
    if (error instanceof mongoose.Error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Database operation failed."
      );
    }

    // OpenAI / OpenRouter API errors
    if (error?.status) {
      switch (error.status) {
        case 400:
          throw new ApiError(httpStatus.BAD_REQUEST, "Invalid AI request.");

        case 401:
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "AI API authentication failed."
          );

        case 429:
          throw new ApiError(
            httpStatus.TOO_MANY_REQUESTS,
            "AI rate limit exceeded. Please try again later."
          );

        case 503:
          throw new ApiError(
            httpStatus.SERVICE_UNAVAILABLE,
            "AI service is temporarily unavailable."
          );

        case 504:
          throw new ApiError(
            httpStatus.GATEWAY_TIMEOUT,
            "All AI models are currently overloaded."
          );

        default:
          throw new ApiError(
            httpStatus.BAD_GATEWAY,
            "AI service error occurred."
          );
      }
    }

    // Fallback
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong while getting AI suggestions."
    );
  }
};

export default getAISuggestions;

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
