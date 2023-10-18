const searchableFields: string[] = [];

const filterableFields = ["searchTerm", "user"];

const fieldsToPopulate = [
  {
    path: "user",
    select: "_id firstName middleName lastName email",
  },
];

export const FeedbackConstants = {
  searchableFields,
  filterableFields,
  fieldsToPopulate,
};
