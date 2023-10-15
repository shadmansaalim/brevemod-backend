//Imports
import { IGenericErrorMessage } from "./error";

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
