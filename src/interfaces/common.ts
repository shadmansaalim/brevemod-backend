//Imports
import { IGenericErrorMessage } from "./error";
import { Types } from "mongoose";
import { ENUM_USER_ROLES } from "../enums/users";
import { JwtPayload } from "jsonwebtoken";

// Error response format
export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

// Generic Response Type
export type IGenericResponse<T> = {
  meta: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  data: T;
};

// Conditional Options Type
export type ConditionalOptions<T, K extends keyof T> = T[K] extends null
  ? []
  : [T[K]];

export interface Context {
  user: JwtPayload | null;
}
