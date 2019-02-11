import { gql, makeExecutableSchema } from 'apollo-server';
import { merge } from 'lodash';
import { Group } from './schemas/Group';
import { User, userResolver } from './schemas/User';

const base = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export default makeExecutableSchema({
  typeDefs: [base, Group, User],
  resolvers: merge(userResolver),
});
