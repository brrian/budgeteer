import { endOfMonth, isAfter, parse } from 'date-fns';
import db from '../../models';

export const getBudgetForDate = async (date: string, groupId: string) => {
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
};
