export const typeDefs = `#graphql
  type Query {
    posts: PostQueryResponse
  }
  type Mutation {
    addPost(post: PostInput!):PostMutationResponse
    updatePost(postId: ID! post: PostInput!):PostMutationResponse
    deletePost(postId: ID!):PostMutationResponse
  }
  type Post {
    _id: ID!
    content: String!
    media: MediaType
    author: User!
    createdAt: String!
    published: Boolean!
    parent: ID
    children: [ID]
    reactions: [ReactionType]
  }
  type MediaType {
    type: String!
    url: String!
  }
  type ReactionType {
    react: String!
    user: ID!
  }
  type User{
    _id: ID!
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
    content: String
  }
`;
