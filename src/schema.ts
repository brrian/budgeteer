import { gql, makeExecutableSchema } from 'apollo-server';
import { applyMiddleware } from 'graphql-middleware';
import GraphQLJSON from 'graphql-type-json';
import { merge } from 'lodash';
import rules from './rules';
import { Budget, budgetResolver } from './schemas/Budget';
import { Categories, categoriesResolver } from './schemas/Categories';
import { Group } from './schemas/Group';
import { Split } from './schemas/Split';
import { Stash, stashResolver } from './schemas/Stash';
import { Transaction, transactionResolver } from './schemas/Transaction';
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

export default applyMiddleware(
  makeExecutableSchema({
    typeDefs: [
      baseDefs,
      Budget,
      Categories,
      Group,
      Split,
      Stash,
      Transaction,
      User,
    ],
    resolvers: merge(
      baseResolvers,
      budgetResolver,
      categoriesResolver,
      stashResolver,
      transactionResolver,
      userResolver
    ),
  }),
  rules
);
