export const typeDefs = `#graphql
  scalar Upload
  type Query {
    posts(filter: String!): PostQueryResponse
  }
  type Mutation {
    addPost(post: PostInput!):PostMutationResponse
    updatePost(postId: ID! post: PostInput!):PostMutationResponse
    deletePost(postId: ID!):PostMutationResponse
    reactPost(postId: ID! reaction:String!): PostMutationResponse
    removeReactionFromPost(postId: ID!): PostMutationResponse
  }
  type Post {
    _id: ID!
    content: String!
    author: User!
    createdAt: String!
    updatedAt: String!
    published: Boolean!
    reactions: [ReactionType]
  }
  type ReactionType {
    react: String!
    user: ID!
  }
  type User{
    _id: ID!
    role: String!
    firstName: String!
    middleName: String
    lastName: String!
    email: String!
    createdAt: String!
    posts: [Post]
  }
  type PostQueryResponse{
    statusCode: Int!
    success: Boolean!
    message: String!
    data: [Post]
  }
  type PostMutationResponse{
    statusCode: Int!
    success: Boolean!
    message: String!
    data: Post!
  }
  input PostInput {
    content: String!
  }
`;
