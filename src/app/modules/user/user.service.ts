// Imports
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import getAllDocuments from "../../../shared/getAllDocuments";
import { IUser, IUserFilters } from "./user.interface";
import { UserConstants } from "./user.constant";
import { User } from "./user.model";

const getAllFromDb = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { page, limit, total, result } = await getAllDocuments(
    filters,
    paginationOptions,
    UserConstants.searchableFields,
    User,
    UserConstants.fieldsToPopulate
  );

  return {
    meta: {
      page,
      limit,
      total,
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
  getAllFromDb,
  getOneById,
  updateOneById,
  deleteOneById,
};
