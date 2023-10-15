import { IUser } from "../user/user.interface";

// Login User Service function arguments
export type ILoginUser = {
  email: string;
  password: string;
};

// Login User Response type
export type ILoginUserResponse = {
  accessToken: string;
  refreshToken: string;
  user: IUser;
};

// Refresh toke  Response type
export type IRefreshTokenResponse = {
  accessToken: string;
};

// Change Password Req Arg Type
export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};
