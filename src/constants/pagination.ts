// Imports
import { SortOrder } from 'mongoose';

// Pagination  Fields
const fields = ['page', 'limit', 'sortBy', 'sortOrder'];

// Pagination Defaults
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT_BY = 'createdAt';
const DEFAULT_SORT_ORDER: SortOrder = 'desc';

export const PaginationConstants = {
  fields,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
};
