//Imports
import { Model } from "mongoose";

export type ICourse = {
  title: string;
  description: string;
  instructorName: string;
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
