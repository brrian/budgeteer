import { Context } from '../..';
import { getBudgetForDate } from './helpers';
import { QueryBudget } from './typeDef';

export default {
  Query: {
    budget(_: any, { date }: QueryBudget, { groupId }: Context) {
      return getBudgetForDate(date, groupId);
    },
  },
};
