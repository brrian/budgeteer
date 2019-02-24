import { rule, shield } from 'graphql-shield';
import { Context } from '.';
import db from './models';

const isAuthenticated = rule()(
  async (_: any, args: any, { groupId, userId }: Context) => {
    if (!groupId || !userId) {
      return new Error('You are not logged in');
    }

    const user = await db.User.findByPk(userId);

    if (!user || user.groupId !== groupId) {
      return new Error('Could not authenticate user');
    }

    return true;
  }
);

export default shield({
  Query: {
    budget: isAuthenticated,
    categories: isAuthenticated,
    monthlyStash: isAuthenticated,
    stash: isAuthenticated,
    transactions: isAuthenticated,
    user: isAuthenticated,
  },

  Mutation: {
    addTransaction: isAuthenticated,
    deleteTransaction: isAuthenticated,
    syncServiceTransactions: isAuthenticated,
    toggleTransaction: isAuthenticated,
  },
});
