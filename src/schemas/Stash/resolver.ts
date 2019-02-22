import { format, startOfMonth } from 'date-fns';
import { Context } from '../..';
import db from '../../models';
import { QueryStashForMonth } from './typeDef';

export default {
  Query: {
    async stash(_: any, args: any, { groupId }: Context) {
      const stash = await db.Stash.findByPk(groupId);

      if (!stash) {
        throw new Error('Stash does not exist for group');
      }

      return stash;
    },

    async monthlyStash(
      _: any,
      { date }: QueryStashForMonth,
      { groupId }: Context
    ) {
      const startMonth = format(startOfMonth(new Date(date)), 'YYYY-MM');

      const stash = await db.Stash.findByPk(groupId);

      if (!stash) {
        throw new Error('Stash does not exist for group');
      }

      return stash.months[startMonth] || 0;
    },
  },
};
