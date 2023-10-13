/* eslint-disable  @typescript-eslint/no-this-alias */

// Imports
import { Schema, model } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../../config";
import { ENUM_USER_ROLES } from "../../../enums/users";

// User Schema
const userSchema = new Schema<IUser, UserModel>(
  {
    role: {
      type: String,
      required: true,
      enum: ENUM_USER_ROLES,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    passwordChangedAt: {
      type: Date,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course", // Reference to the Course model
        default: [],
      },
    ],
    purchase: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course", // Reference to the Course model
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Static Method to check whether user exists or not
userSchema.statics.exists = async function (
  email: string
): Promise<Pick<IUser, "_id" | "email" | "role" | "password"> | null> {
  return await User.findOne(
    { email },
    { _id: 1, email: 1, role: 1, password: 1 }
  ).lean();
};

// Static Method to check whether password matches or not
userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// Pre Hook function to hash user password before saving in DB
userSchema.pre("save", async function (next) {
  // Hashing user password before saving
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  // Saving password changed time if password is changed
  this.passwordChangedAt = new Date();

  next();
});

// User Model
export const User = model<IUser, UserModel>("User", userSchema);
