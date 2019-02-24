import { gql } from 'apollo-server';

export interface MutateAddTransaction {
  amount: number;
  categoryId: number;
  date: string;
  description: string;
  groupId: string;
  note?: string;
}

export interface MutateDeleteTransaction {
  id: string;
}

export interface MutateSplitTransaction {
  amount: number;
  categoryId: number;
  description: string;
  note?: string;
  transactionId: string;
}

export interface MutateSyncServiceTransactions {
  service: string;
  transactions: any;
}

export interface MutateToggleTransaction {
  id: string;
}

export default gql`
  type Transaction {
    amount: Float
    categoryId: Int
    description: String
    disabled: Boolean
    id: String
    note: String
    splits: [Split]
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
      note: String
    ): Transaction

    deleteTransaction(id: String!): Boolean

    splitTransaction(
      amount: Float!
      categoryId: Int!
      transactionId: String!
      description: String!
      note: String
    ): Split

    syncServiceTransactions(
      service: String!
      transactions: JSON!
    ): [Transaction]

    toggleTransaction(id: String!): Transaction
  }
`;
