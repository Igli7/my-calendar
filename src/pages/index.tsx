import Head from 'next/head';
import {
  compareAsc,
  subHours,
  isBefore,
  isSameDay,
  addMinutes,
  addMonths,
} from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import Calendar from '@/components/Calendar';

import styles from '@/styles/Home.module.css';

const Home = () => {
  const date = new Date();
  const nyDate = utcToZonedTime(date, `America/New_York`);
  const parisDate = utcToZonedTime(date, `Europe/Paris`);

  const newDate = new Date(`Jan 31, 2021, 20:51`);
  const newDate1 = new Date(`Jul 15, 2021, 8:51 PM`);

  console.log('DATE', date);
  console.log('DATE NOW', nyDate);
  console.log('DATE NOW + 30 min', addMinutes(nyDate, 30));
  console.log('PARIS', parisDate);

  console.log(`THE NEW DATE`, newDate);
  console.log(`THE NEW DATE 1`, addMonths(newDate, 1));

  const nyTime = format(nyDate, `MMM dd, yyyy, HH:mm`);
  const isS = isSameDay(nyDate, new Date(`Thursday`));
  const isBeforeBool = isBefore(nyDate, newDate);

  console.log(`IS BEFORE`, isBeforeBool);
  console.log(`IS SAME DAY`, isS);

  return (
    <div className={styles.container}>
      <Head>
        <title>TypeScript starter for Next.js</title>
        <meta
          name="description"
          content="TypeScript starter for Next.js that includes all you need to build amazing apps"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Calendar />
      <h1>NEW YORK:{JSON.stringify(format(nyDate, `MMM dd, yyyy, HH:mm`))}</h1>
      <h1>PARIS:{JSON.stringify(format(parisDate, `yyyy-MM-dd HH:mm`))}</h1>
    </div>
  );
};
export default Home;
