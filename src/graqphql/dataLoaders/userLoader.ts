// Imports
import DataLoader, { BatchLoadFn } from "dataloader";
import { Types } from "mongoose";
import { IUser } from "../../app/modules/user/user.interface";
import { User } from "../../app/modules/user/user.model";

const batchUsers: BatchLoadFn<string, IUser> = async (
  userIds: readonly string[]
): Promise<IUser[]> => {
  const userObjectIds = userIds.map((id) => new Types.ObjectId(id));
  const users = await User.find({ _id: { $in: userObjectIds } });

  // Formatting to pass in data loader
  const userData: { [key: string]: IUser } = {};

  users.forEach((user) => {
    userData[user._id as unknown as string] = user;
  });

  return userIds.map((userId) => userData[userId]);
};

export const userLoader = new DataLoader<string, IUser>(batchUsers);
