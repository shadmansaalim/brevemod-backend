// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CourseModuleService } from "./courseModule.service";
import { ICourseModule } from "./courseModule.interface";

const createCourseModule = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseModuleService.createCourseModule(req.body);

  sendResponse<ICourseModule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course Module created successfully.",
    data: result,
  });
});

const addContentToCourseModule = catchAsync(
  async (req: Request, res: Response) => {
    const { moduleId } = req.params;
    const result = await CourseModuleService.addContentToCourseModule(
      moduleId,
      req.body
    );

    sendResponse<ICourseModule>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Content added to module successfully.",
      data: result,
    });
  }
);

const getAllModulesByCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const result = await CourseModuleService.getAllModulesByCourse(courseId);

    sendResponse<ICourseModule[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Course modules retrieved successfully.",
      data: result,
    });
  }
);

export const CourseModuleController = {
  createCourseModule,
  addContentToCourseModule,
  getAllModulesByCourse,
};