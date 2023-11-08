// Imports

import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { Course } from "../course/course.model";
import { tax_course_purchase } from "../../../constants/common";
import { Types } from "mongoose";
import { Cart } from "./cart.model";
import { Purchase } from "../purchase/purchase.model";
import { ICart } from "./cart.interface";

const getUserCart = async (authUserId: string): Promise<ICart | null> => {
  // Finding cart
  const cart = await Cart.findOne({ user: authUserId });

  // Throwing error if cart does not exists
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User cart does not exists.");
  }

  return cart;
};

const addToCart = async (
  authUserId: string,
  courseId: Types.ObjectId
): Promise<ICart | null> => {
  // Finding cart
  const cart = await Cart.findOne({ user: authUserId });

  // Throwing error if cart does not exists
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User cart does not exists.");
  }

  const course = await Course.findOne({ _id: courseId });

  // Throwing error if course does not exists
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course does not exists.");
  }

  const courseAlreadyInCart = cart.courses.find((course) =>
    course._id.equals(courseId)
  );

  if (courseAlreadyInCart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Course already added in cart.");
  }

  // Finding User Purchases
  const userPurchases = await Purchase.findOne({ user: authUserId });

  if (userPurchases) {
    // Finding course in user purchases
    const checkAlreadyPurchased = (
      userPurchases.courses as Types.ObjectId[]
    ).find((course) => course._id.equals(courseId));

    // Throwing error if user tries to purchase a course which he/she did already
    if (checkAlreadyPurchased) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `You cannot add a course to cart that you already purchased once.`
      );
    }
  }

  // Storing new cart data
  cart.courses = [courseId, ...cart.courses];

  // Adding course price to subtotal
  cart.payment.subTotal += course.price;

  // Calculating tax
  cart.payment.tax =
    cart.payment?.subTotal * tax_course_purchase - cart.payment?.subTotal;

  // Calculating grand total
  cart.payment.grandTotal = cart.payment.subTotal + cart.payment.tax;

  return await Cart.findOneAndUpdate({ user: authUserId }, cart, {
    new: true,
  });
};

const removeFromCart = async (
  authUserId: string,
  courseId: Types.ObjectId
): Promise<ICart | null> => {
  // Finding cart
  const cart = await Cart.findOne({ user: authUserId });

  // Throwing error if cart does not exists
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User cart does not exists.");
  }

  const course = await Course.findOne({ _id: courseId });

  // Throwing error if course does not exists
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course does not exists.");
  }

  const courseExistsInCart = cart.courses.find((course) =>
    course._id.equals(courseId)
  );

  if (!courseExistsInCart) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Course is not in cart so nothing to remove."
    );
  }

  // Const new courses in cart
  const newCourses = cart.courses.filter(
    (course) => !course._id.equals(courseId)
  );

  // Removing course price from subtotal
  cart.payment.subTotal -= course.price;

  // Calculating tax
  cart.payment.tax =
    cart.payment?.subTotal * tax_course_purchase - cart.payment?.subTotal;

  // Calculating grand total
  cart.payment.grandTotal = cart.payment.subTotal + cart.payment.tax;

  // Storing new cart data
  cart.courses = [...newCourses];

  return await Cart.findOneAndUpdate({ user: authUserId }, cart, {
    new: true,
  });
};
export const CartService = {
  getUserCart,
  addToCart,
  removeFromCart,
};
