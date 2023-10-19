// Imports
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import getAllDocuments from "../../../shared/getAllDocuments";
import { IUser, IUserFilters } from "./user.interface";
import { UserConstants } from "./user.constant";
import { User } from "./user.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import config from "../../../config";
import { Types } from "mongoose";

const insertIntoDb = async (payload: IUser): Promise<IUser> => {
  if (!payload.password) {
    payload.password = config.default_user_password as string;
  }

  const newUser = await User.create(payload);

  // Throwing error if fails to create user
  if (!newUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Failed to create an user`);
  }

  return newUser;
};

const getAllFromDb = async (
  authUserId: string,
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { page, limit, total, totalPage, result } = await getAllDocuments(
    filters,
    paginationOptions,
    UserConstants.searchableFields,
    User,
    UserConstants.fieldsToPopulate
  );

  // Storing current user record at first index of result array
  const currentUserIndexInResult = result.findIndex((user: IUser) =>
    user?._id.equals(new Types.ObjectId(authUserId))
  );

  const currentUser = result.find((user: IUser) =>
    user?._id.equals(new Types.ObjectId(authUserId))
  );

  if (currentUserIndexInResult !== -1) {
    result.splice(currentUserIndexInResult, 1);
    result.unshift(currentUser);
  }

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

const getOneById = async (id: string): Promise<IUser | null> => {
  return await User.findOne({ _id: id })
    .populate({
      path: "cart",
      populate: [
        {
          path: "courses",
        },
      ],
    })
    .populate({
      path: "purchases",
    });
};

const updateOneById = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
    .populate({
      path: "cart",
      populate: [
        {
          path: "courses",
        },
      ],
    })
    .populate({
      path: "purchases",
    });
};

const deleteOneById = async (id: string): Promise<IUser | null> => {
  return await User.findOneAndDelete({ _id: id })
    .populate({
      path: "cart",
      populate: [
        {
          path: "courses",
        },
      ],
    })
    .populate({
      path: "purchases",
    });
};

export const UserService = {
  insertIntoDb,
  getAllFromDb,
  getOneById,
  updateOneById,
  deleteOneById,
};
