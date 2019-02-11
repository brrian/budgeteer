const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    name: String
    email: String
    group: Group
  }

  type Group {
    name: String
  }

  type Query {
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): String
    createUser(name: String!, email: String!, password: String!): User
  }
`;
