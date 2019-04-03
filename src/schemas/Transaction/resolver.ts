import { endOfMonth, format, parse, startOfMonth } from 'date-fns';
import { isEmpty } from 'lodash';
import { Op } from 'sequelize';
import { Context } from '../..';
import db from '../../models';
import { TransactionInstance } from '../../models/Transaction';
import {
  getTransactionData,
  shouldUpdateStash,
  updateOutdatedStashes,
  updateStashIfNeeded,
} from './helpers';
import {
  MutateAddTransaction,
  MutateDeleteTransaction,
  MutateSplitTransaction,
  MutateSyncServiceTransactions,
  MutateToggleTransaction,
  MutateUpdateTransaction,
  QueryTransactions,
} from './typeDef';

const findTransaction = async (id: string, groupId: string) => {
  const transaction = await db.Transaction.findByPk(id, { where: { groupId } });

  if (!transaction) {
    throw new Error('Transaction does not exist by that id');
  }

  return transaction;
};

export default {
  Query: {
    async transactions(
      _: any,
      { date }: QueryTransactions,
      { groupId }: Context
    ) {
      const startDate = format(startOfMonth(parse(date)), 'YYYY-MM-DD');
      const endDate = format(endOfMonth(parse(date)), 'YYYY-MM-DD');

      return db.Transaction.findAll({
        include: [db.Split],
        order: [['date', 'DESC']],
        where: {
          date: { [Op.between]: [startDate, endDate] },
          groupId,
        },
      });
    },
  },

  Mutation: {
    async addTransaction(
      _: any,
      { amount, categoryId, date, description, note }: MutateAddTransaction,
      { groupId }: Context
    ) {
      const transaction = await db.Transaction.create({
        amount,
        categoryId,
        date,
        description,
        groupId,
        note,
        originalAmount: amount,
      });

      const stash = await updateStashIfNeeded(transaction);

      return {
        stashTotal: stash !== false ? stash.total : null,
        transaction: { ...transaction.toJSON(), Splits: [] },
        updatedStash: stash !== false,
      };
    },

    async deleteTransaction(
      _: any,
      { id }: MutateDeleteTransaction,
      { groupId }: Context
    ) {
      const transaction = await findTransaction(id, groupId);

      await transaction.destroy();

      updateStashIfNeeded(transaction);

      return true;
    },

    async splitTransaction(
      _: any,
      args: MutateSplitTransaction,
      { groupId }: Context
    ) {
      const transaction = await findTransaction(args.transactionId, groupId);

      if (args.amount >= transaction.amount) {
        throw new Error('Split amount is greater than transaction amount');
      }

      const [split] = await Promise.all([
        db.Split.create(args),
        transaction.update({ amount: transaction.amount - args.amount }),
      ]);

      return split;
    },

    async syncServiceTransactions(
      _: any,
      { service, transactions }: MutateSyncServiceTransactions,
      { groupId }: Context
    ) {
      const outdatedStashes: { [key: string]: boolean } = {};

      const syncedTransactions = await Promise.all(
        JSON.parse(transactions).map(async (serviceMeta: any) => {
          const { serviceId, data } = getTransactionData(service, serviceMeta);

          const [transaction, created] = await db.Transaction.findOrCreate({
            where: { groupId, serviceId },
            defaults: {
              ...data,
              amount: data.originalAmount,
              groupId,
              serviceId,
              serviceMeta,
            },
          });

          if (!created) {
            transaction.update({
              date: data.date,
              originalAmount: data.originalAmount,
            });
          }

          const startDate = startOfMonth(parse(transaction.date));
          if (shouldUpdateStash(startDate)) {
            outdatedStashes[startDate.toISOString()] = true;
          }

          return transaction;
        })
      );

      if (!isEmpty(outdatedStashes)) {
        updateOutdatedStashes(Object.keys(outdatedStashes), groupId);
      }

      return syncedTransactions;
    },

    async toggleTransaction(
      _: any,
      { id }: MutateToggleTransaction,
      { groupId }: Context
    ) {
      const transaction = await findTransaction(id, groupId);

      await transaction.update({ disabled: !transaction.disabled });

      updateStashIfNeeded(transaction);

      return transaction;
    },

    async updateTransaction(
      _: any,
      args: MutateUpdateTransaction,
      { groupId }: Context
    ) {
      const transaction = await findTransaction(args.id, groupId);

      transaction.set(args);

      const isToggled = transaction.changed('disabled');

      await transaction.save();

      if (isToggled) {
        updateStashIfNeeded(transaction);
      }

      return transaction;
    },
  },

  Transaction: {
    async splits(transaction: TransactionInstance) {
      return transaction.Splits;
    },
  },
};
