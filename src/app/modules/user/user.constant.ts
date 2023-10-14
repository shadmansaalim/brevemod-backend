const searchableFields = ["email", "firstName", "middleName", "lastName"];

const filterableFields = ["searchTerm", "_id", "email"];

const fieldsToPopulate = [
  {
    path: "cart",
    populate: [
      {
        path: "courses",
      },
    ],
  },
  {
    path: "purchases",
  },
];

export const UserConstants = {
  searchableFields,
  filterableFields,
  fieldsToPopulate,
};
