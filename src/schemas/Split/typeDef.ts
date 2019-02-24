import { gql } from 'apollo-server';

export default gql`
  type Split {
    amount: Float
    categoryId: Int
    description: String
    disabled: Boolean
    id: String
    note: String
  }
`;
