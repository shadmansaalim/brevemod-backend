// Imports

import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { PaymentHelpers } from "../../../helpers/paymentHelper";
import { currency, payment_method_types } from "../../../constants/common";
import { Course } from "../course/course.model";
import { ICourse } from "../course/course.interface";
import { Cart } from "../cart/cart.model";
import { Purchase } from "./purchase.model";
import mongoose from "mongoose";
import { IPurchase } from "./purchase.interface";
import { Types } from "mongoose";

const getMyCourses = async (authUserId: string): Promise<ICourse[]> => {
  // Finding user
  const user = await User.findOne({ _id: authUserId });

  // Throwing error if user does not exists
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  // Finding User Purchases
  const userPurchases = await Purchase.findOne({ user: authUserId }).populate(
    "courses"
  );

  // Throwing error if user does not exists
  if (!userPurchases) {
    throw new ApiError(httpStatus.NOT_FOUND, "You have no purchased courses.");
  }

  const myCourses = userPurchases.courses as ICourse[];

  return myCourses;
};

const getIsCoursePurchased = async (
  authUserId: string,
  courseId: string
): Promise<boolean> => {
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

  // Finding is course purchased
  const isPurchased = await Purchase.findOne({
    user: authUserId,
    courses: { $elemMatch: { $eq: courseId } },
  });

  if (isPurchased) {
    return true;
  } else {
    return false;
  }
};

const createPaymentIntent = async (
  authUserId: string
): Promise<{ clientSecret: string }> => {
  // Finding user cart
  const cart = await Cart.findOne({ user: authUserId });

  // Throwing error if user cart does not exists
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User cart does not exists.");
  }

  if (!cart.courses.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cart is empty nothing to pay for."
    );
  }

  // Getting the payment amount for stripe purchasing course
  const amount = PaymentHelpers.getPaymentAmountForStripe(
    Math.round(cart.payment.grandTotal)
  );

  //Creating Payment intent
  const paymentIntent = await PaymentHelpers.stripe.paymentIntents.create({
    currency,
    amount,
    payment_method_types,
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
};

// Function to purchase course
const purchaseCourse = async (
  authUserId: string
): Promise<IPurchase | null> => {
  // Finding cart
  const cart = await Cart.findOne({ user: authUserId });

  // Throwing error if user cart does not exists
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User cart does not exists.");
  }

  if (!cart.courses.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You have nothing in your cart to purchase`
    );
  }

  // Finding User Purchases
  const userPurchases = await Purchase.findOne({ user: authUserId });

  if (userPurchases) {
    // Check if course already purchased
    const checkAlreadyPurchased = cart.courses.filter((id) =>
      (userPurchases.courses as Types.ObjectId[]).includes(id)
    );

    // Throwing error if user tries to purchase a course which he/she did already
    if (checkAlreadyPurchased.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `You cannot purchase a course that you already purchased once.`
      );
    }
  }

  let newPurchaseData = null;

  // Mongoose session started
  const session = await mongoose.startSession();

  try {
    // Starting Transaction
    session.startTransaction();

    if (userPurchases) {
      // Adding courses to purchase list
      userPurchases.courses = [
        ...cart.courses,
        ...(userPurchases.courses as Types.ObjectId[]),
      ];
      newPurchaseData = await Purchase.findOneAndUpdate(
        { user: authUserId },
        userPurchases,
        {
          new: true,
        }
      );
    } else {
      newPurchaseData = await Purchase.create({
        user: authUserId,
        courses: [...cart.courses],
      });
    }

    // Throwing error if fails to update purchase data
    if (!newPurchaseData) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Failed to purchase courses.`);
    }

    // Resetting user cart
    const userUpdatedCart = {
      user: authUserId,
      courses: [],
      payment: {
        subTotal: 0.0,
        tax: 0.0,
        grandTotal: 0.0,
      },
    };

    const resetCart = await Cart.findOneAndUpdate(
      { user: authUserId },
      userUpdatedCart,
      {
        new: true,
      }
    );

    // Throwing error if fails
    if (!resetCart) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Failed to purchase courses.`);
    }

    const newPurchaseDataCourses = newPurchaseData.courses;

    // Updating student count for each courses
    for (const courseId of newPurchaseDataCourses) {
      const purchasingCourse = await Course.findOne({
        _id: courseId,
      });

      // Throwing error if course not found
      if (!purchasingCourse) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Course does not exist.`);
      }

      const studentsCount = purchasingCourse.studentsCount + 1;

      const updateCourse = await Course.findOneAndUpdate(
        {
          _id: courseId,
        },
        { studentsCount }
      );

      // Throwing error update fails
      if (!updateCourse) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Something went wrong.`);
      }
    }

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

  return newPurchaseData;
};

export const PurchaseService = {
  getMyCourses,
  getIsCoursePurchased,
  createPaymentIntent,
  purchaseCourse,
};
