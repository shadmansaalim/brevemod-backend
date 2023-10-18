const searchableFields: string[] = [];

const filterableFields = ["searchTerm", "user"];

const fieldsToPopulate = [
  {
    path: "user",
    select: "firstName middleName lastName email",
  },
];

export const FeedbackConstants = {
  searchableFields,
  filterableFields,
  fieldsToPopulate,
};
