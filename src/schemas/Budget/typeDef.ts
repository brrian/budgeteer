import { gql } from 'apollo-server';

export interface QueryBudget {
  date: string;
}

export default gql`
  type Budget {
    categories: JSON
    total: Int
  }

  extend type Query {
    budget(date: String!): Budget
  }
`;
