//Imports
import { Model } from "mongoose";
import { Types } from "mongoose";

export type ICourse = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  instructorName: string;
  totalRating: number;
  ratingCount: number;
  avgRating?: number;
  price: number;
  thumbnailLink: string;
  introVideoLink: string;
  lecturesCount: number;
  projectsCount: number;
  studentsCount?: number;
};

export type CourseModel = Model<ICourse>;

export type ICourseFilters = {
  searchTerm?: string | undefined;
};
