// Imports
import { Response } from 'express';

// API Response Type
type IApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  } | null;
  data?: T | null;
};

// Function to send API Response ~ Reusable
const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  // API Response data
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || null,
    data: data.data || null,
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
