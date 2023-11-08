// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CartService } from "./cart.service";
import { Types } from "mongoose";
import { ICart } from "./cart.interface";

const getUserCart = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const result = await CartService.getUserCart(user.id);

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User cart retrieved successfully",
    data: result,
  });
});

const addToCart = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  // Course that is requested to add in cart
  const courseId = new Types.ObjectId(req.params.courseId);

  const result = await CartService.addToCart(user.id, courseId);

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course added to cart successfully",
    data: result,
  });
});

const removeFromCart = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  // Course that is requested to add in cart
  const courseId = new Types.ObjectId(req.params.courseId);

  const result = await CartService.removeFromCart(user.id, courseId);

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course removed from cart successfully",
    data: result,
  });
});

export const CartController = {
  getUserCart,
  addToCart,
  removeFromCart,
};
