import { EBBINGHAUS_INTERVALS } from '../constants';

export const getNextReviewDate = (currentCheckCount: number): number => {
  // If check count is 0 (first time), next review is tomorrow (index 0 -> 1 day)
  // If check count is 1, next review is +2 days, etc.
  const intervalDays = EBBINGHAUS_INTERVALS[Math.min(currentCheckCount, EBBINGHAUS_INTERVALS.length - 1)];
  const now = new Date();
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + intervalDays);
  return nextDate.getTime();
};

export const isDue = (nextReviewDate: number): boolean => {
  return Date.now() >= nextReviewDate;
};
