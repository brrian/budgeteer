import { gql } from 'apollo-server';

export interface MutateDeleteSplit {
  id: string;
}

export interface MutateToggleSplit {
  id: string;
}

export interface MutateUpdateSplit {
  categoryId?: number;
  disabled?: boolean;
  id: string;
  note?: string;
}

export default gql`
  type Split {
    amount: Float
    categoryId: Int
    disabled: Boolean
    id: String
    note: String
  }

  extend type Mutation {
    deleteSplit(id: String!): Boolean

    toggleSplit(id: String!): Split

    updateSplit(
      categoryId: Int
      disabled: Boolean
      id: String!
      note: String
    ): Split
  }
`;
