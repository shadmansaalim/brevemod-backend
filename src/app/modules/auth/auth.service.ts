// Imports
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
import { User } from "../user/user.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import config from "../../../config";
import { JwtHelpers } from "../../../helpers/jwtHelper";
import { Secret } from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../user/user.interface";
import { ENUM_USER_ROLES } from "../../../enums/users";

// Sign up user function
const signUpUser = async (payload: IUser): Promise<IUser> => {
  // Set user role by default its STUDENT for everyone who signs up
  payload.role = ENUM_USER_ROLES.STUDENT;

  const newUser = await User.create(payload);

  // Throwing error if fails to create user
  if (!newUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Failed to create an user`);
  }

  return newUser;
};

// LOGIN user function
const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  // Destructuring id and password
  const { email, password: loginPassword } = payload;

  // Checking whether user exists or not
  const userExists = await User.exists(email);

  // Throwing error if user does not exists
  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  // Destructuring
  const { _id: id, role, password } = userExists;

  // Comparing Password
  const isPasswordMatched = await User.isPasswordMatched(
    loginPassword,
    password
  );

  // Throwing error if password does not matches
  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect Password.");
  }

  // Create access token
  const accessToken = JwtHelpers.createToken(
    { id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  // Create refresh token
  const refreshToken = JwtHelpers.createToken(
    { id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

// Refresh token function
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  // Verify given token
  try {
    verifiedToken = JwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token.");
  }

  // Destructuring
  const { id, role } = verifiedToken;

  // Checking whether user exists or not as sometimes deleted user might try to access using refresh token.
  const userExists = await User.exists(id);

  // Throwing error if user does not exists
  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  // Generate new access token
  const newAccessToken = JwtHelpers.createToken(
    { id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

// Change Password function
const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  // Destructuring old and new password
  const { oldPassword, newPassword } = payload;

  // Checking whether user exists or not
  const userExists = await User.findOne({ id: user?.id }).select("+password");

  // Throwing error if user does not exists
  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  // Checking given old password is correct or not
  const isPasswordMatched = await User.isPasswordMatched(
    oldPassword,
    userExists.password
  );

  // Throwing error if password does not matches
  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect Password.");
  }

  // Set Updated data
  userExists.password = newPassword;

  // Updating document using save
  userExists.save();
};

export const AuthService = {
  signUpUser,
  loginUser,
  refreshToken,
  changePassword,
};
