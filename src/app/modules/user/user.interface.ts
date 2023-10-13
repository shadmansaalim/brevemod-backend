/* eslint-disable  no-unused-vars */

//Imports
import { Model } from "mongoose";
import { ENUM_USER_ROLES } from "../../../enums/users";
import { Types } from "mongoose";

// User Interface
export type IUser = {
  _id: Types.ObjectId;
  role: ENUM_USER_ROLES;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
};

// User Model Type
export type UserModel = {
  exists(id: string): Promise<Pick<IUser, "_id" | "role" | "password"> | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
