import { gql } from 'apollo-server';

export interface MutateDeleteSplit {
  id: string;
}
export interface MutateToggleSplit {
  id: string;
}

export default gql`
  type Split {
    amount: Float
    categoryId: Int
    description: String
    disabled: Boolean
    id: String
    note: String
  }

  extend type Mutation {
    deleteSplit(id: String!): Boolean

    toggleSplit(id: String!): Split
  }
`;
