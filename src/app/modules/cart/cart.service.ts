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
  const user = await User.findOne({ _id: authUserId })
    .populate({
      path: "cart",
      populate: [
        {
          path: "courses",
        },
      ],
    })
    .populate({
      path: "purchases",
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

  // User Cart
  const cart = user.cart;

  const courseAlreadyInCart = (cart.courses as ICourse[]).find((course) =>
    course._id.equals(courseId)
  );

  if (courseAlreadyInCart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Course already added in cart.");
  }

  // Finding course in user purchases
  const checkAlreadyPurchased = (user.purchases as ICourse[]).find((course) =>
    course._id.equals(courseId)
  );

  // Throwing error if user tries to purchase a course which he/she did already
  if (checkAlreadyPurchased) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You cannot add a course to cart that you already purchased once.`
    );
  }

  // Storing new cart data
  cart.courses = [course, ...(cart.courses as ICourse[])];

  // Adding course price to subtotal
  cart.payment.subTotal += course.price;

  // Calculating tax
  cart.payment.tax =
    cart.payment?.subTotal * tax_course_purchase - cart.payment?.subTotal;

  // Calculating grand total
  cart.payment.grandTotal = cart.payment.subTotal + cart.payment.tax;

  return await User.findOneAndUpdate(
    { _id: authUserId },
    { cart },
    {
      new: true,
    }
  )
    .populate({
      path: "cart",
      populate: [
        {
          path: "courses",
        },
      ],
    })
    .populate({
      path: "purchases",
    });
};

const removeFromCart = async (
  authUserId: string,
  courseId: Types.ObjectId
): Promise<IUser | null> => {
  // Finding user
  const user = await User.findOne({ _id: authUserId })
    .populate({
      path: "cart",
      populate: [
        {
          path: "courses",
        },
      ],
    })
    .populate({
      path: "purchases",
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

  // User Cart
  const cart = user.cart;

  const courseExistsInCart = (cart.courses as ICourse[]).find((course) =>
    course._id.equals(courseId)
  );

  if (!courseExistsInCart) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Course is not in cart so nothing to remove."
    );
  }

  // Const new courses in cart
  const newCourses = (cart.courses as ICourse[]).filter(
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

  return await User.findOneAndUpdate(
    { _id: authUserId },
    { cart },
    {
      new: true,
    }
  )
    .populate({
      path: "cart",
      populate: [
        {
          path: "courses",
        },
      ],
    })
    .populate({
      path: "purchases",
    });
};
export const CartService = {
  addToCart,
  removeFromCart,
};
