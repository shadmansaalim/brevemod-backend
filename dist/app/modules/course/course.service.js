"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const getAllDocuments_1 = __importDefault(require("../../../shared/getAllDocuments"));
const course_model_1 = require("./course.model");
const course_constant_1 = require("./course.constant");
const mongoose_1 = require("mongoose");
const user_model_1 = require("../user/user.model");
const mongoose_2 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const purchase_model_1 = require("../purchase/purchase.model");
const userCourseRating_model_1 = require("../userCourseRating/userCourseRating.model");
const extractJsonFromMessage_1 = require("../../../helpers/extractJsonFromMessage");
const withApiKeyFallback_1 = require("../../../helpers/withApiKeyFallback");
const insertIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_model_1.Course.create(payload);
});
const getAllFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, total, totalPage, result } = yield (0, getAllDocuments_1.default)(filters, paginationOptions, course_constant_1.CourseConstants.searchableFields, course_model_1.Course);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        data: result,
    };
});
const getOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_model_1.Course.findOne({ _id: new mongoose_1.Types.ObjectId(id) });
});
const updateOneById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_model_1.Course.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(id) }, payload, {
        new: true,
    });
});
const deleteOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if any user purchased this course
    const anyPurchase = yield purchase_model_1.Purchase.findOne({
        courses: { $elemMatch: { $eq: new mongoose_1.Types.ObjectId(id) } },
    });
    // Throwing error if admin tries to delete a course where students are enrolled
    if (anyPurchase) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, "There are students who purchased this course for which we cannot remove it from our system.");
    }
    return yield course_model_1.Course.findOneAndDelete({ _id: id });
});
const addCourseRating = (authUserId, courseId, rating) => __awaiter(void 0, void 0, void 0, function* () {
    // Finding user
    const user = yield user_model_1.User.findOne({ _id: authUserId });
    // Throwing error if user does not exists
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    const course = yield course_model_1.Course.findOne({ _id: courseId });
    // Throwing error if course does not exists
    if (!course) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course does not exists.");
    }
    const userPurchases = yield purchase_model_1.Purchase.findOne({ user: authUserId });
    // Throwing error if user didn't purchase
    if (!userPurchases || !userPurchases.courses.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You have not purchased this course.");
    }
    const isCoursePurchasedByUser = userPurchases.courses.find((course) => course.equals(courseId));
    // Throwing error if user didn't purchase
    if (!isCoursePurchasedByUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You have not purchased this course.");
    }
    const userAlreadyReviewed = yield userCourseRating_model_1.UserCourseRating.findOne({
        courseId,
        user: authUserId,
    });
    // Throwing error if user already reviewed this course
    if (userAlreadyReviewed) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You already gave your review for this course.");
    }
    let newUserRating = null;
    // Mongoose session started
    const session = yield mongoose_2.default.startSession();
    try {
        // Starting Transaction
        session.startTransaction();
        // Add new review
        newUserRating = yield userCourseRating_model_1.UserCourseRating.create({
            courseId,
            user: authUserId,
            rating,
        });
        // Calculating new avg rating
        const totalRating = course.totalRating + rating;
        const ratingCount = course.ratingCount + 1;
        const avgRating = totalRating / ratingCount;
        // Updating avg rating in course
        yield course_model_1.Course.findOneAndUpdate({ _id: courseId }, { totalRating, ratingCount, avgRating });
        // Committing Transaction
        yield session.commitTransaction();
        // Ending Session
        yield session.endSession();
    }
    catch (error) {
        // Aborting Transaction because of error
        yield session.abortTransaction();
        // Ending Session because of error
        yield session.endSession();
        // Throwing error
        throw error;
    }
    return newUserRating;
});
const getUserCourseRating = (authUserId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userCourseRating_model_1.UserCourseRating.findOne({ courseId, user: authUserId });
});
// This will give suggestions to the user which courses to do for the given job description
const FREE_MODELS = [
    "nvidia/nemotron-3-super-120b-a12b:free",
    "z-ai/glm-4.5-air:free",
    "poolside/laguna-m.1:free",
    "openai/gpt-oss-120b:free",
];
const getAISuggestions = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Validate payload
        if (!payload || !((_a = payload.jobDescription) === null || _a === void 0 ? void 0 : _a.trim())) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You need to pass the job description for which you want AI suggestions.");
        }
        // Get all courses
        const courses = yield course_model_1.Course.find({}).lean();
        if (!courses.length) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No courses available.");
        }
        // Format courses for the prompt
        const courseList = courses
            .map((course, index) => `${index + 1}. ID: ${course._id}
Title: ${course.title}
Description: ${course.description}`)
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
        let completion = null;
        let lastError = null;
        // Try models one by one if 504 occurs
        for (const model of FREE_MODELS) {
            try {
                console.log(`Trying AI model: ${model}`);
                completion = yield (0, withApiKeyFallback_1.withApiKeyFallback)((client) => client.chat.completions.create({
                    model,
                    messages: [
                        {
                            role: "system",
                            content: "You are a career advisor that provides course suggestions.",
                        },
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                }));
                // Success → break loop
                console.log(`SUCCESS WITH MODEL: ${model}`);
                break;
            }
            catch (error) {
                console.error(`MODEL FAILED: ${model}`, error);
                lastError = error;
                // If 504 → try next model
                if ((error === null || error === void 0 ? void 0 : error.status) === 504) {
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
        const aiMessage = (_c = (_b = completion === null || completion === void 0 ? void 0 : completion.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message;
        if (!aiMessage) {
            throw new ApiError_1.default(http_status_1.default.BAD_GATEWAY, "AI returned an empty response.");
        }
        // Parse JSON response
        const suggestions = (0, extractJsonFromMessage_1.extractJsonFromMessage)(aiMessage);
        if (!Array.isArray(suggestions)) {
            throw new ApiError_1.default(http_status_1.default.BAD_GATEWAY, "Invalid AI response format.");
        }
        if (!suggestions.length) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No course suggestions found.");
        }
        // Filter invalid AI data
        const validSuggestions = suggestions.filter((suggestion) => (suggestion === null || suggestion === void 0 ? void 0 : suggestion.courseId) &&
            mongoose_2.default.Types.ObjectId.isValid(suggestion.courseId) &&
            (suggestion === null || suggestion === void 0 ? void 0 : suggestion.reason));
        if (!validSuggestions.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_GATEWAY, "AI returned invalid course suggestions.");
        }
        // Create maps
        const suggestionsReasonMap = new Map(validSuggestions.map((s) => [String(s.courseId), s.reason]));
        const suggestedCourseIds = new Set(validSuggestions.map((s) => String(s.courseId)));
        // Build final result
        const result = courses
            .filter((course) => suggestedCourseIds.has(String(course._id)))
            .map((course) => {
            const courseObj = typeof course.toObject === "function" ? course.toObject() : course;
            return Object.assign(Object.assign({}, courseObj), { reason: suggestionsReasonMap.get(String(course._id)) });
        });
        if (!result.length) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No matching courses found from AI suggestions.");
        }
        return result;
    }
    catch (error) {
        console.error("GET AI SUGGESTIONS ERROR:", error);
        // Already handled custom error
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        // MongoDB / Mongoose errors
        if (error instanceof mongoose_2.default.Error) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Database operation failed.");
        }
        // OpenAI / OpenRouter API errors
        if (error === null || error === void 0 ? void 0 : error.status) {
            switch (error.status) {
                case 400:
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid AI request.");
                case 401:
                    throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "AI API authentication failed.");
                case 429:
                    throw new ApiError_1.default(http_status_1.default.TOO_MANY_REQUESTS, "AI rate limit exceeded. Please try again later.");
                case 503:
                    throw new ApiError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, "AI service is temporarily unavailable.");
                case 504:
                    throw new ApiError_1.default(http_status_1.default.GATEWAY_TIMEOUT, "All AI models are currently overloaded.");
                default:
                    throw new ApiError_1.default(http_status_1.default.BAD_GATEWAY, "AI service error occurred.");
            }
        }
        // Fallback
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Something went wrong while getting AI suggestions.");
    }
});
exports.default = getAISuggestions;
exports.CourseService = {
    insertIntoDb,
    getAllFromDb,
    getOneById,
    updateOneById,
    deleteOneById,
    addCourseRating,
    getUserCourseRating,
    getAISuggestions,
};
