import { gql } from 'apollo-server';

export default gql`
  type Categories {
    categories: JSON
  }

  extend type Query {
    categories: JSON
  }
`;
