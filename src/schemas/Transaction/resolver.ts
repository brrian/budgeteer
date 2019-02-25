import { parse, startOfMonth } from 'date-fns';
import { isEmpty } from 'lodash';
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
} from './typeDef';

export default {
  Query: {
    async transactions(_: any, args: any, { groupId }: Context) {
      return await db.Transaction.findAll({ where: { groupId } });
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

      updateStashIfNeeded(transaction);

      return transaction;
    },

    async deleteTransaction(
      _: any,
      { id }: MutateDeleteTransaction,
      { groupId }: Context
    ) {
      const transaction = await db.Transaction.findByPk(id, {
        where: { groupId },
      });

      if (!transaction) {
        throw new Error('Transaction does not exist by that id');
      }

      await transaction.destroy();

      updateStashIfNeeded(transaction);

      return true;
    },

    async splitTransaction(
      _: any,
      args: MutateSplitTransaction,
      { groupId }: Context
    ) {
      const transaction = await db.Transaction.findByPk(args.transactionId, {
        where: { groupId },
      });

      if (!transaction) {
        throw new Error('Transaction does not exist by that id');
      } else if (args.amount >= transaction.amount) {
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
        transactions.map(async (serviceMeta: any) => {
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
            transaction.update(data);
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

    async toggleTransaction(_: any, { id }: MutateToggleTransaction) {
      const transaction = await db.Transaction.findByPk(id);

      if (!transaction) {
        throw new Error('Transaction does not exist by that id');
      }

      await transaction.update({ disabled: !transaction.disabled });

      updateStashIfNeeded(transaction);

      return transaction;
    },
  },

  Transaction: {
    async splits(transaction: TransactionInstance) {
      return await transaction.getSplits();
    },
  },
};
