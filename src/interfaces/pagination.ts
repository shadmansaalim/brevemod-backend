// Imports
import { SortOrder } from 'mongoose';

// Pagination Options Type
export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};

export type ICalculatePaginationResult = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
  skip: number;
};
