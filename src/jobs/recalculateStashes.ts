import { subMonths } from 'date-fns';
import pMap from 'p-map';
import db from '../models';
import { updateOutdatedStashes } from '../schemas/Transaction/helpers';

export const recalculateStashes = async () => {
  const groups = await db.Group.findAll();
  const date = subMonths(new Date(), 1).toISOString();

  pMap(groups, group => updateOutdatedStashes([date], group.id!), {
    concurrency: 2,
  });
};
