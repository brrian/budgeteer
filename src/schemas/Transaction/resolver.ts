import { Context } from '../..';
import db from '../../models';
import { TransactionInstance } from '../../models/Transaction';
import { getTransactionData } from './helpers';
import {
  MutateAddTransaction,
  MutateDeleteTransaction,
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
      return await db.Transaction.create({
        amount,
        categoryId,
        date,
        description,
        groupId,
        note,
        originalAmount: amount,
      });
    },

    async deleteTransaction(_: any, { id }: MutateDeleteTransaction) {
      const destroyedRows = await db.Transaction.destroy({ where: { id } });

      return destroyedRows === 1;
    },

    async syncServiceTransactions(
      _: any,
      { service, transactions }: MutateSyncServiceTransactions,
      { groupId }: Context
    ) {
      return await Promise.all(
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

          // Update monthly totals if necessary

          return transaction;
        })
      );
    },

    async toggleTransaction(_: any, { id }: MutateToggleTransaction) {
      const transaction = await db.Transaction.findByPk(id);

      if (!transaction) {
        throw new Error('Transaction does not exist by that id');
      }

      await transaction.update({ disabled: !transaction.disabled });

      return transaction;
    },
  },

  Transaction: {
    async splits(transaction: TransactionInstance) {
      return await transaction.getSplits();
    },
  },
};
