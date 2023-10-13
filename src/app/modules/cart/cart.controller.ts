// Imports
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IUser } from "../user/user.interface";
import { CartService } from "./cart.service";
import { Types } from "mongoose";

const addToCart = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  // Course that is requested to add in cart
  const courseId = new Types.ObjectId(req.params.courseId);

  const result = await CartService.addToCart(user.id, courseId);

  sendResponse<IUser>(res, {
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

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course removed from cart successfully",
    data: result,
  });
});

export const CartController = {
  addToCart,
  removeFromCart,
};
