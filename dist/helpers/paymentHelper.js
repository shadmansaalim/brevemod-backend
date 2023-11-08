"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentHelpers = void 0;
const config_1 = __importDefault(require("../config"));
const stripe = require("stripe")(config_1.default.stripe__payment_secret);
const getPaymentAmountForStripe = (value) => {
    return value * 100;
};
exports.PaymentHelpers = { stripe, getPaymentAmountForStripe };
