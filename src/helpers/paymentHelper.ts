import config from "../config";

const stripe = require("stripe")(config.stripe__payment_secret);

const getPaymentAmountForStripe = (value: number) => {
  return value * 100;
};

export const PaymentHelpers = { stripe, getPaymentAmountForStripe };
