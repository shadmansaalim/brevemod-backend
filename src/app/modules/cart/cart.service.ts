// Imports

import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { Course } from "../course/course.model";
import { tax_course_purchase } from "../../../constants/common";
import { IUser } from "../user/user.interface";
import { Types } from "mongoose";
import { ICourse } from "../course/course.interface";

const addToCart = async (
  authUserId: string,
  courseId: Types.ObjectId
): Promise<IUser | null> => {
  // Finding user
  const user = await User.findOne({ _id: authUserId }).populate({
    path: "cart",
    populate: [
      {
        path: "courses",
      },
    ],
  });

  // Throwing error if user does not exists
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  const course = await Course.findOne({ _id: courseId });

  // Throwing error if course does not exists
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course does not exists.");
  }

  // User
  const cart = user.cart;

  // Adding course price to subtotal
  cart.payment.subTotal += course.price;

  // Calculating tax
  cart.payment.tax =
    cart.payment?.subTotal * tax_course_purchase - cart.payment?.subTotal;

  // Calculating grand total
  cart.payment.grandTotal = cart.payment.subTotal + cart.payment.tax;

  // Storing new cart data
  cart.courses = [course, ...(cart.courses as ICourse[])];

  return await User.findOneAndUpdate(
    { _id: authUserId },
    { cart },
    {
      new: true,
    }
  ).populate({
    path: "cart",
    populate: [
      {
        path: "courses",
      },
    ],
  });
};

const removeFromCart = async (
  authUserId: string,
  courseId: Types.ObjectId
): Promise<IUser | null> => {
  // Finding user
  const user = await User.findOne({ _id: authUserId }).populate({
    path: "cart",
    populate: [
      {
        path: "courses",
      },
    ],
  });

  // Throwing error if user does not exists
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  const course = await Course.findOne({ _id: courseId });

  // Throwing error if course does not exists
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course does not exists.");
  }

  // User
  const cart = user.cart;

  // Removing course price from subtotal
  cart.payment.subTotal -= course.price;

  // Calculating tax
  cart.payment.tax =
    cart.payment?.subTotal * tax_course_purchase - cart.payment?.subTotal;

  // Calculating grand total
  cart.payment.grandTotal = cart.payment.subTotal + cart.payment.tax;

  // Const new courses in cart
  const newCourses = (cart.courses as ICourse[]).filter(
    (course) => !course._id.equals(courseId)
  );

  // Storing new cart data
  cart.courses = [...newCourses];

  return await User.findOneAndUpdate(
    { _id: authUserId },
    { cart },
    {
      new: true,
    }
  ).populate({
    path: "cart",
    populate: [
      {
        path: "courses",
      },
    ],
  });
};
export const CartService = {
  addToCart,
  removeFromCart,
};
