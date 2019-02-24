import { endOfMonth, isAfter, parse } from 'date-fns';
import { Context } from '../..';
import db from '../../models';
import { QueryBudget } from './typeDef';

export default {
  Query: {
    async budget(_: any, { date }: QueryBudget, { groupId }: Context) {
      const endDate = endOfMonth(parse(date));

      const budgets = await db.Budget.findAll({
        where: { groupId },
        order: [['createdAt', 'DESC']],
      });

      const budget = budgets.find(item =>
        isAfter(endDate, new Date(item.createdAt!))
      );

      // If we can't find a budget, return the oldest one
      return budget || budgets[budgets.length - 1];
    },
  },
};
