import { utcToZonedTime } from 'date-fns-tz';

const timeZoned = (date: any) => {
  return utcToZonedTime(date, 'America/New_York');
};

export default timeZoned;
