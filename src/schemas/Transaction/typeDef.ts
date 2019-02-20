import { gql } from 'apollo-server';

export interface MutateAddTransaction {
  amount: number;
  categoryId: number;
  date: string;
  description: string;
  groupId: string;
}

export interface MutateToggleTransaction {
  id: string;
}

export default gql`
  type Transaction {
    amount: Float
    category: String
    categoryId: Int
    description: String
    disabled: Boolean
    id: String
  }

  extend type Query {
    transactions: [Transaction]
  }

  extend type Mutation {
    addTransaction(
      amount: Float!
      categoryId: Int!
      date: String!
      description: String!
    ): Transaction

    toggleTransaction(id: String!): Transaction
  }
`;
