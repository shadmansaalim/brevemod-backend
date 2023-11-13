// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { PaginationConstants } from "../../../constants/pagination";
import { CourseService } from "./course.service";
import { ICourse } from "./course.interface";
import { CourseConstants } from "./course.constant";
import { IUserCourseRating } from "../userCourseRating/userCourseRating.interface";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const { ...courseData } = req.body;
  const result = await CourseService.insertIntoDb(courseData);

  sendResponse<ICourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course created successfully.",
    data: result,
  });
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, CourseConstants.filterableFields);

  const paginationOptions = pick(req.query, PaginationConstants.fields);

  const result = await CourseService.getAllFromDb(filters, paginationOptions);

  sendResponse<ICourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses retrieved successfully.",
    meta: result?.meta,
    data: result?.data,
  });
});

const getOneById = catchAsync(async (req: Request, res: Response) => {
  const courseId = req.params.courseId;

  const result = await CourseService.getOneById(courseId);

  sendResponse<ICourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result,
  });
});

const updateOneById = catchAsync(async (req: Request, res: Response) => {
  const courseId = req.params.courseId;
  const updatedData = req.body;

  const result = await CourseService.updateOneById(courseId, updatedData);

  sendResponse<ICourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

const deleteOneById = catchAsync(async (req: Request, res: Response) => {
  const courseId = req.params.courseId;

  const result = await CourseService.deleteOneById(courseId);

  sendResponse<ICourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course deleted successfully.",
    data: result,
  });
});

const addCourseRating = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const { courseId } = req.params;

  const result = await CourseService.addCourseRating(
    user.id,
    courseId,
    req.body.rating
  );

  sendResponse<IUserCourseRating>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Course rating added successfully.",
    data: result,
  });
});

const getUserCourseRating = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;
  const courseId = req.params.courseId;

  const result = await CourseService.getUserCourseRating(user.id, courseId);

  sendResponse<IUserCourseRating>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Course Rating retrieved successfully",
    data: result,
  });
});

export const CourseController = {
  insertIntoDb,
  getAllFromDb,
  getOneById,
  updateOneById,
  deleteOneById,
  addCourseRating,
  getUserCourseRating,
};
