// Imports
import { Course } from "../course/course.model";
import { User } from "../user/user.model";
import { CourseReview } from "../courseReview/courseReview.model";
import { Feedback } from "../feedback/feedback.model";

// This function is to fetch data that needs to be displayed in admin dashboard based on requirements
const getAdminDashboardData = async (): Promise<{
  coursesCount: number;
  usersCount: number;
  courseReviewsCount: number;
  feedbacksCount: number;
}> => {
  // Courses count
  const coursesCount = await Course.countDocuments({});

  // Users count
  const usersCount = await User.countDocuments({});

  // Course Reviews count
  const courseReviewsCount = await CourseReview.countDocuments({});

  // Feedbacks count
  const feedbacksCount = await Feedback.countDocuments({});

  return {
    coursesCount,
    usersCount,
    courseReviewsCount,
    feedbacksCount,
  };
};

export const AdminDashboardService = {
  getAdminDashboardData,
};
