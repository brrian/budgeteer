import { Context } from '../..';
import db from '../../models';
import { MutateAddTransaction } from './typeDef';

export default {
  Query: {
    async transactions(_: any, args: any, { groupId }: Context) {
      if (!groupId) {
        throw new Error('You are not logged in');
      }

      const [categories, transactions] = await Promise.all([
        db.Categories.findOne({ where: { groupId } }),
        db.Transaction.findAll({ where: { groupId } }),
      ]);

      if (!categories) {
        throw new Error('Categories do not exist for group');
      }

      return transactions.map(transaction => ({
        ...transaction.toJSON(),
        category: categories.categories[transaction.categoryId],
      }));
    },
  },

  Mutation: {
    async addTransaction(
      _: any,
      { amount, categoryId, date, description }: MutateAddTransaction,
      { groupId }: Context
    ) {
      if (!groupId) {
        throw new Error('You are not logged in');
      }

      return await db.Transaction.create({
        groupId,
        date,
        description,
        categoryId,
        amount,
        originalAmount: amount,
      });
    },
  },
};
