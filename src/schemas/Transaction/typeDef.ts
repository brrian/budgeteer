import { gql } from 'apollo-server';

export interface QueryTransactions {
  date: string;
}

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
  note?: string;
  transactionId: string;
}

export interface MutateSyncServiceTransactions {
  service: string;
  transactions: string;
}

export interface MutateToggleTransaction {
  id: string;
}

export interface MutateUpdateTransaction {
  categoryId?: number;
  description?: string;
  disabled?: boolean;
  id: string;
  note?: string;
}

export default gql`
  type Transaction {
    amount: Float
    categoryId: Int
    date: String
    description: String
    disabled: Boolean
    id: String
    note: String
    splits: [Split]
  }

  extend type Query {
    transactions(date: String!): [Transaction]
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
      note: String
    ): Split

    syncServiceTransactions(
      service: String!
      transactions: String!
    ): [Transaction]

    toggleTransaction(id: String!): Transaction

    updateTransaction(
      categoryId: Int
      description: String
      disabled: Boolean
      id: String!
      note: String
    ): Transaction
  }
`;
