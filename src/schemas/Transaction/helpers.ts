import { endOfMonth, format, isBefore, parse, startOfMonth } from 'date-fns';
import { sum, sumBy } from 'lodash';
import { Op } from 'sequelize';
import db from '../../models';
import { getBudgetForDate } from '../Budget/helpers';
import { TransactionInstance } from '../../models/Transaction';

export const getTransactionData = (service: string, transaction: any) => {
  switch (service) {
    case 'personal-capital':
      return {
        serviceId: transaction.userTransactionId,
        data: {
          categoryId: transaction.categoryId,
          date: transaction.transactionDate,
          description: transaction.description,
          originalAmount: transaction.amount,
        },
      };
    default:
      throw new Error(`Unknown service id "${service}"`);
  }
};

export const shouldUpdateStash = (date: Date) => {
  const curMonth = startOfMonth(new Date());
  return isBefore(date, curMonth);
};

export const updateOutdatedStashes = async (
  dates: string[],
  groupId: string
) => {
  const stash = await db.Stash.findByPk(groupId);

  if (!stash) {
    throw new Error('Could not locate stash for group');
  }

  await Promise.all(
    dates.map(async date => {
      const startDate = startOfMonth(date);
      const endDate = endOfMonth(date);

      const [total, budget] = await Promise.all([
        await sumTransactionsFromRange(groupId, startDate, endDate),
        await getBudgetForDate(date, groupId),
      ]);

      const month = format(startDate, 'YYYY-MM-DD');
      const net = budget.total - total;

      stash.months = { ...stash.months, [month]: net };
    })
  );

  stash.total = sum(Object.values(stash.months));

  return stash.save();
};

export const updateStashIfNeeded = (transaction: TransactionInstance) => {
  const date = parse(transaction.date);

  if (shouldUpdateStash(date)) {
    return updateOutdatedStashes([date.toISOString()], transaction.groupId);
  }

  return false;
};

const sumTransactionsFromRange = async (
  groupId: string,
  startDate: Date,
  endDate: Date
) => {
  const transactions = await db.Transaction.findAll({
    where: {
      date: { [Op.between]: [startDate, endDate] },
      groupId,
    },
    include: [
      {
        model: db.Split,
        where: { disabled: false },
        required: false,
      },
    ],
  });

  return transactions.reduce((carry, transaction) => {
    if (!transaction.disabled) {
      carry += transaction.amount;
    }

    if (transaction.Splits && transaction.Splits.length) {
      carry += sumBy(transaction.Splits, 'amount');
    }

    return carry;
  }, 0);
};
