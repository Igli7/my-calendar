import React, { useEffect, useState } from 'react';

import {
  isBefore,
  isSameDay,
  addMinutes,
  startOfMonth,
  startOfWeek,
  endOfMonth,
  endOfWeek,
  subDays,
  addDays,
  isSameMonth,
  addMonths,
  subMonths,
  isAfter,
  roundToNearestMinutes,
} from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import cn from 'classnames';
import timeZoned from '@/utils/timeZoned';

import styles from './Calendar.module.scss';
import Modal from '../Modal';
import TimePicker from '../TimePicker';
import { data, excludedDates } from '@/mock';
import TimeInterval from '../TimeInterval';

interface SelectedDate {
  date: Date;
  status: 'Open' | 'Closed';
  openTime: string;
  closeTime: string;
}

const Calendar = () => {
  const [calendar, setCalendar] = useState<Array<Array<{}>>>([]);
  const [value, setValue] = useState(timeZoned(new Date()));
  const [selectedDate, setSelectedDate] = useState<null | SelectedDate>(null);
  const [today, setToday] = useState(null);
  const [selectedTime, setSelectedTime] = useState();
  const [showCustom, setShowCutsom] = useState(Boolean);

  const startDayOfCalendar = startOfWeek(startOfMonth(value));
  const endDayOfCalendar = endOfWeek(endOfMonth(value));

  console.log('calendar', calendar);
  console.log('VALUEE', value);

  useEffect(() => {
    const excludedDate = excludedDates.find((date) =>
      isSameDay(timeZoned(new Date(date.date)), timeZoned(new Date())),
    );
    console.log('IM LOOKING', excludedDate);

    const dayOfTheWeek = data.find((date) => {
      console.log('DATEEEEE', format(timeZoned(new Date()), 'EEEE'));
      return date.dayOfWeek === format(timeZoned(new Date()), 'EEEE');
    });
    console.log('DAMNNNN', dayOfTheWeek);

    if (excludedDate) {
      setToday({
        date: timeZoned(new Date()),
        status: excludedDate.status,
        openTime: utcToZonedTime(
          new Date(
            `${format(timeZoned(new Date()), 'MMM dd, yyyy')} ${
              excludedDate.openTime
            }`,
          ),
          'America/New_York',
        ),
        closeTime: utcToZonedTime(
          new Date(
            `${format(timeZoned(new Date()), 'MMM dd, yyyy')} ${
              excludedDate.closeTime
            }`,
          ),
          'America/New_York',
        ),
      });
    } else if (dayOfTheWeek && dayOfTheWeek.status !== 'Closed') {
      setToday({
        date: timeZoned(new Date()),
        status: dayOfTheWeek.status,
        openTime: utcToZonedTime(
          new Date(
            `${format(timeZoned(new Date()), 'MMM dd, yyyy')} ${
              dayOfTheWeek.openTime
            }`,
          ),
          'America/New_York',
        ),
        closeTime: utcToZonedTime(
          new Date(
            `${format(timeZoned(new Date()), 'MMM dd, yyyy')} ${
              dayOfTheWeek.closeTime
            }`,
          ),
          'America/New_York',
        ),
      });
    }
  }, []);

  useEffect(() => {
    let day = subDays(startDayOfCalendar, 1);
    const calendarArray = [];

    while (isBefore(day, subDays(endDayOfCalendar, 1))) {
      calendarArray.push(
        Array(7)
          .fill(0)
          .map(() => {
            day = addDays(day, 1);
            const excludedDate = excludedDates.find((date) =>
              isSameDay(timeZoned(new Date(date.date)), day),
            );
            console.log('IM LOOKING', excludedDate);
            const dayOfTheWeek = data.find(
              (date) => date.dayOfWeek === format(day, 'EEEE'),
            );

            if (format(day, 'MMM dd, yyyy') === excludedDate?.date) {
              return {
                date: day,
                status: excludedDate.status,
                openTime: excludedDate.openTime,
                closeTime: excludedDate.closeTime,
              };
            } else {
              return {
                date: day,
                status: dayOfTheWeek?.status,
                openTime: dayOfTheWeek?.openTime,
                closeTime: dayOfTheWeek?.closeTime,
              };
            }
          }),
      );
    }

    console.log('CALENDAT', calendarArray);

    setCalendar(calendarArray);
  }, [value]);

  // const [sevenOpenDays, setSevenOpenDays] = useState([]);

  // useEffect(() => {
  //   if (calendar.length >= 1) {
  //     let bol = false;
  //     let arr = [];

  //     calendar.map((week) => {
  //       week.map((day) => {
  //         const sameDay = sevenOpenDays.find((openDay) =>
  //           isSameDay(openDay.date, day.date),
  //         );
  //         console.log('IS THE SAME FUCKING DAY', sameDay);
  //         if (
  //           day.status === 'Open' &&
  //           (isAfter(day.date, new Date()) ||
  //             isSameDay(day.date, new Date())) &&
  //           !sameDay
  //         ) {
  //           arr.push(day);
  //         }
  //       });
  //     });

  //     console.log('ARRAYYY', ...arr);

  //     setSevenOpenDays([...sevenOpenDays, ...arr]);
  //   }
  // }, [calendar]);

  // useEffect(() => {
  //   if (sevenOpenDays.length < 7) {
  //     setValue(addMonths(value, 1));
  //     console.log('VALUe', value);
  //   }
  // }, [sevenOpenDays]);

  console.log('TODAYYYY', today);
  console.log('SELECTED TIME', selectedTime);

  return (
    <div className={styles.calendar}>
      <div className={styles.headar}>
        <h1>{format(value, 'MMMM yyyy')}</h1>
        <button onClick={() => setValue(subMonths(value, 1))}>{'<'}</button>
        {' * '}
        <button onClick={() => setValue(addMonths(value, 1))}>{'>'}</button>
      </div>
      {calendar.map((week: any, i) => (
        <div key={i}>
          {week.map((day: any, i) => {
            return (
              <button
                className={cn(styles.day, {
                  [styles.activeBtn]: isSameMonth(day.date, value),
                })}
                disabled={isSameMonth(day.date, value) ? false : true}
                onClick={() =>
                  isSameMonth(day.date, value) && setSelectedDate(day)
                }
                key={i}
              >
                <div
                  className={cn({
                    [styles.isNotSameMonth]: !isSameMonth(day.date, value),
                    [styles.isToday]: isSameDay(day.date, new Date()),
                    [styles.isClosed]: day.status === 'Closed',
                  })}
                >
                  {format(day.date, 'd')}
                </div>
              </button>
            );
          })}
        </div>
      ))}

      <TimeInterval
        setSelectedTime={setSelectedTime}
        setShowCutsom={setShowCutsom}
        date={today}
      />

      {selectedDate !== null && (
        <Modal closeModal={() => setSelectedDate(null)}>
          <h1>{format(selectedDate?.date, 'EE MMM dd')}</h1>
        </Modal>
      )}
      {showCustom && (
        <Modal closeModal={() => setShowCutsom(false)}>
          <TimePicker today={today} />
        </Modal>
      )}
    </div>
  );
};

export default Calendar;
