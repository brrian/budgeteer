import schedule from 'node-schedule';
import { recalculateStashes } from './recalculateStashes';

export const scheduleJobs = () => {
  schedule.scheduleJob('0 0 1 1/1 * ? *', recalculateStashes);
};
