import { gql } from 'apollo-server';

export interface MutateLogin {
  email: string;
  password: string;
}

export interface MutateCreateUser {
  name: string;
  email: string;
  password: string;
  group: string;
}

export default gql`
  type User {
    name: String
    email: String
    group: Group
  }

  extend type Query {
    user: User
  }

  extend type Mutation {
    login(email: String!, password: String!): String

    createUser(
      name: String!
      email: String!
      password: String!
      group: String!
    ): User
  }
`;
