// Imports
import { PaginationHelpers } from "../helpers/paginationHelper";
import { IPaginationOptions } from "../interfaces/pagination";
import { SortOrder, Model } from "mongoose";

const getAllDocuments = async (
  filters: { [key: string]: any },
  paginationOptions: IPaginationOptions,
  searchableFields: string[],
  model: Model<any>,
  fieldsToPopulate?: any[]
) => {
  // Destructuring ~ Searching and Filtering
  const { searchTerm, ...filterData } = filters;

  // Storing all searching and filtering condition in this array
  const searchFilterConditions = [];

  // Checking if SEARCH is requested in GET API - adding find conditions
  if (searchTerm) {
    searchFilterConditions.push({
      $or: searchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Checking if FILTER is requested in GET API - adding find conditions
  if (Object.keys(filterData).length) {
    searchFilterConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Destructuring ~ Pagination and Sorting
  const { page, limit, sortBy, sortOrder, skip } =
    PaginationHelpers.calculatePagination(paginationOptions);

  // Default Sorting Condition
  const sortingCondition: { [key: string]: SortOrder } = {};

  // Adding sort condition if requested
  if (sortBy && sortOrder) {
    sortingCondition[sortBy] = sortOrder;
  }

  // Condition for finding documents
  const findConditions = searchFilterConditions.length
    ? { $and: searchFilterConditions }
    : {};

  // Base Query object that stores the query
  const baseQuery = model
    .find(findConditions)
    .sort(sortingCondition)
    .sort({ createdAt: "asc" })
    .skip(skip)
    .limit(limit);

  // Checking if fields needs to be populated
  if (fieldsToPopulate && fieldsToPopulate.length) {
    // Chain the populate calls for each field
    fieldsToPopulate.forEach((field) => {
      baseQuery.populate(field);
    });
  }

  // Documents
  const result = await baseQuery.exec();

  // Total Documents in Database matching the condition
  const total = await model.countDocuments(findConditions);

  // Total page count
  const totalPage = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPage,
    result,
  };
};

export default getAllDocuments;
