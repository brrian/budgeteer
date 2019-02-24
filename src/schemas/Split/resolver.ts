import db from '../../models';
import { MutateToggleSplit } from './typeDef';

export default {
  Mutation: {
    async toggleSplit(_: any, { id }: MutateToggleSplit) {
      const split = await db.Split.findByPk(id);

      if (!split) {
        throw new Error('Split does not exist by that id');
      }

      await split.update({ disabled: !split.disabled });

      return split;
    },
  },
};
