import { gql, makeExecutableSchema } from 'apollo-server';
import GraphQLJSON from 'graphql-type-json';
import { merge } from 'lodash';
import { Categories, categoriesResolver } from './schemas/Categories';
import { Group } from './schemas/Group';
import { User, userResolver } from './schemas/User';

const baseDefs = gql`
  scalar JSON

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const baseResolvers = {
  JSON: GraphQLJSON,
};

export default makeExecutableSchema({
  typeDefs: [baseDefs, Categories, Group, User],
  resolvers: merge(baseResolvers, categoriesResolver, userResolver),
});
