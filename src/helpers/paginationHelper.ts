// Imports
import { PaginationConstants } from '../constants/pagination';
import {
  ICalculatePaginationResult,
  IPaginationOptions,
} from '../interfaces/pagination';

// Helper function for Feature Pagination
const calculatePagination = (
  options: IPaginationOptions
): ICalculatePaginationResult => {
  const page = Number(options?.page || PaginationConstants.DEFAULT_PAGE);
  const limit = Number(options?.limit || PaginationConstants.DEFAULT_LIMIT);
  const sortBy = options?.sortBy || PaginationConstants.DEFAULT_SORT_BY;
  const sortOrder =
    options?.sortOrder || PaginationConstants.DEFAULT_SORT_ORDER;
  // Number of data to skip
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    skip,
  };
};

export const PaginationHelpers = { calculatePagination };
