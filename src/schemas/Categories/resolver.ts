import { Context } from '../..';
import db from '../../models';

export default {
  Query: {
    async categories(_: any, args: any, { groupId }: Context) {
      if (!groupId) {
        throw new Error('You are not logged in');
      }

      const categories = await db.Categories.findOne({
        where: { groupId },
      });

      if (!categories) {
        throw new Error('Categories do not exist for group');
      }

      return categories.categories;
    },
  },
};
