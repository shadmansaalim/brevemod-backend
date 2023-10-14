// Imports

import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { PaymentHelpers } from "../../../helpers/paymentHelper";
import { currency, payment_method_types } from "../../../constants/common";

// Function to create a student in database
const purchaseCourse = async (
  authUserId: string
): Promise<{ clientSecret: string }> => {
  // Finding user
  const user = await User.findOne({ _id: authUserId }).populate({
    path: "cart",
    populate: [
      {
        path: "courses",
      },
      {
        path: "purchases",
      },
    ],
  });

  // Throwing error if user does not exists
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  //Payment intent
  let paymentIntent = null;

  // User Cart
  const cart = user.cart;

  if (!cart.courses.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You have nothing in your cart to purchase`
    );
  }

  // Mongoose session started
  const session = await mongoose.startSession();

  try {
    // Starting Transaction
    session.startTransaction();

    // Getting the payment amount for stripe purchasing course
    const amount = PaymentHelpers.getPaymentAmountForStripe(
      cart.payment.grandTotal
    );

    // Creating payment intent
    paymentIntent = await PaymentHelpers.stripe.paymentIntents.create({
      currency,
      amount,
      payment_method_types,
    });

    // Throwing error if payment fails
    if (!paymentIntent) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Failed to process your payment`
      );
    }

    // Extract "_id" values from the objects in each array
    const cartCoursesIds = cart.courses.map((obj) => obj._id.toString());
    const purchaseCoursesIds = user.purchases.map((obj) => obj._id.toString());

    // Check if there are common "_id" values between the two arrays
    const checkAlreadyPurchased = cartCoursesIds.filter((id) =>
      purchaseCoursesIds.includes(id)
    );

    // Throwing error if user tries to purchase a course which he/she did already
    if (checkAlreadyPurchased.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `You cannot purchase a course that you already purchased once.`
      );
    }

    // Updated data, resetting cart and adding purchases data
    const updatedData = {
      cart: {
        courses: [],
        payment: {
          subTotal: 0.0,
          tax: 0.0,
          grandTotal: 0.0,
        },
      },
      purchases: [...cart.courses, ...user.purchases],
    };

    // Updating user purchases data
    await User.findOneAndUpdate({ _id: authUserId }, updatedData, {
      new: true,
    });

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

  return {
    clientSecret: paymentIntent.client_secret,
  };
};

export const PurchaseService = {
  purchaseCourse,
};
