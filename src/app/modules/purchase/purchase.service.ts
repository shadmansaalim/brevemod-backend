// Imports

import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { PaymentHelpers } from "../../../helpers/paymentHelper";
import { currency, payment_method_types } from "../../../constants/common";
import { IUser } from "../user/user.interface";

const createPaymentIntent = async (
  authUserId: string
): Promise<{ clientSecret: string }> => {
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

  if (!user.cart.courses.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cart is empty nothing to pay for."
    );
  }

  // Getting the payment amount for stripe purchasing course
  const amount = PaymentHelpers.getPaymentAmountForStripe(
    user.cart.payment.grandTotal
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
const purchaseCourse = async (authUserId: string): Promise<IUser | null> => {
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

  // User Cart
  const cart = user.cart;

  if (!cart.courses.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You have nothing in your cart to purchase`
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
  return await User.findOneAndUpdate({ _id: authUserId }, updatedData, {
    new: true,
  })
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

export const PurchaseService = {
  createPaymentIntent,
  purchaseCourse,
};
