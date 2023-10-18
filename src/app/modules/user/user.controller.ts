// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { PaginationConstants } from "../../../constants/pagination";
import { UserConstants } from "./user.constant";
import { UserService } from "./user.service";
import { IUser } from "./user.interface";
import { ENUM_USER_ROLES } from "../../../enums/users";

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, UserConstants.filterableFields);

  const paginationOptions = pick(req.query, PaginationConstants.fields);

  const result = await UserService.getAllFromDb(filters, paginationOptions);

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully.",
    meta: result?.meta,
    data: result?.data,
  });
});

const getOneById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserService.getOneById(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateOneById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const updatedData = req.body;
  const result = await UserService.updateOneById(id, updatedData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteOneById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserService.deleteOneById(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully.",
    data: result,
  });
});

export const UserController = {
  getAllFromDb,
  getOneById,
  updateOneById,
  deleteOneById,
};
