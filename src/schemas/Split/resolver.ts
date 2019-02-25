import db from '../../models';
import { updateStashIfNeeded } from '../Transaction/helpers';
import { MutateDeleteSplit, MutateToggleSplit } from './typeDef';

export default {
  Mutation: {
    async deleteSplit(_: any, { id }: MutateDeleteSplit) {
      const destroyedRows = await db.Split.destroy({ where: { id } });

      return destroyedRows === 1;
    },

    async toggleSplit(_: any, { id }: MutateToggleSplit) {
      const split = await db.Split.findByPk(id, {
        include: [db.Transaction],
      });

      if (!split) {
        throw new Error('Split does not exist by that id');
      }

      await split.update({ disabled: !split.disabled });

      updateStashIfNeeded(split.Transaction);

      return split;
    },
  },
};
