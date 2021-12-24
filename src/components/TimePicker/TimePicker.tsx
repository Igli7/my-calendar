import {
  addDays,
  isAfter,
  isSameDay,
  addMinutes,
  roundToNearestMinutes,
} from 'date-fns';
import { format } from 'date-fns-tz';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import { data, excludedDates } from '@/mock';
import timeZoned from '@/utils/timeZoned';

import styles from './TimePicker.module.scss';
import isBefore from 'date-fns/isBefore';
import TimeInterval from '../TimeInterval';

const TimePicker = ({ today }) => {
  const [openDays, setOpenDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeError, setTimeError] = useState('');
  const [selectedTime, setSelectedTime] = useState();
  const [showCustom, setShowCutsom] = useState(Boolean);

  useEffect(() => {
    if (today) {
      let value = timeZoned(new Date());
      let arr = [];

      while (arr.length < 7) {
        const excludedDate = excludedDates.find((date) =>
          isSameDay(timeZoned(new Date(date.date)), value),
        );

        const dayOfTheWeek = data.find(
          (date) => date.dayOfWeek === format(value, 'EEEE'),
        );
        if (excludedDate && excludedDate.status === 'Open') {
          if (isSameDay(value, today.date)) {
            if (isAfter(value, today) && isBefore(value, today)) {
              arr.push({
                date: value,
                status: excludedDate?.status,
                openTime: timeZoned(
                  new Date(`${excludedDate.date} ${excludedDate.openTime}`),
                ),
                closeTime: timeZoned(
                  new Date(`${excludedDate.date} ${excludedDate.closeTime}`),
                ),
              });
            }
          } else {
            arr.push({
              date: value,
              status: excludedDate?.status,
              openTime: timeZoned(
                new Date(`${excludedDate.date} ${excludedDate.openTime}`),
              ),
              closeTime: timeZoned(
                new Date(`${excludedDate.date} ${excludedDate.closeTime}`),
              ),
            });
          }
        } else if (dayOfTheWeek && dayOfTheWeek.status === 'Open') {
          if (isSameDay(value, today.date)) {
            console.log('IS THE SAME FUCKING DAY');
            if (
              isAfter(value, today.openTime) &&
              isBefore(addMinutes(value, 30), today.closeTime)
            ) {
              arr.push({
                date: value,
                status: dayOfTheWeek?.status,
                openTime: timeZoned(
                  new Date(
                    `${format(value, 'MMM dd, yyyy')} ${dayOfTheWeek.openTime}`,
                  ),
                ),
                closeTime: timeZoned(
                  new Date(
                    `${format(value, 'MMM dd, yyyy')} ${
                      dayOfTheWeek.closeTime
                    }`,
                  ),
                ),
              });
            }
          } else {
            arr.push({
              date: value,
              status: dayOfTheWeek?.status,
              openTime: timeZoned(
                new Date(
                  `${format(value, 'MMM dd, yyyy')} ${dayOfTheWeek.openTime}`,
                ),
              ),
              closeTime: timeZoned(
                new Date(
                  `${format(value, 'MMM dd, yyyy')} ${dayOfTheWeek.closeTime}`,
                ),
              ),
            });
          }
        }

        value = addDays(value, 1);
      }

      setOpenDays(arr);
    }
  }, [today]);

  useEffect(() => {
    if (openDays.length > 0) {
      setSelectedDay(openDays[0]);
    }
  }, [openDays]);

  console.log('ARRAYYYYYYY', openDays.length);
  console.log('SELECTED DAY', selectedDay);

  console.log('OPEN DAYS', openDays);

  return (
    <>
      <div>
        {selectedDay && (
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {isSameDay(selectedDay.date, timeZoned(new Date()))
              ? 'Today'
              : isSameDay(selectedDay.date, timeZoned(addDays(new Date(), 1)))
              ? 'Tomorrow'
              : format(selectedDay.date, 'EEE, MMM dd, yyyy')}
          </button>
        )}
        <ul>
          {menuOpen &&
            openDays.map((day, i) => (
              <li key={i}>
                <button onClick={() => setSelectedDay(day)}>
                  {isSameDay(day.date, timeZoned(new Date()))
                    ? 'Today'
                    : isSameDay(day.date, timeZoned(addDays(new Date(), 1)))
                    ? 'Tomorrow'
                    : format(day.date, 'EEE, MMM dd, yyyy')}
                </button>
              </li>
            ))}
        </ul>
      </div>

      {selectedDay && (
        <div>
          Please selecte a time between{' '}
          {isSameDay(selectedDay.date, today.date)
            ? `${format(
                roundToNearestMinutes(addMinutes(selectedDay.date, 30), {
                  nearestTo: 15,
                }),
                'hh:mm aa',
              )} - ${format(selectedDay.closeTime, 'hh:mm aa')}`
            : ` ${format(selectedDay.openTime, 'hh:mm aa')} - 
          ${format(selectedDay.closeTime, 'hh:mm aa')}`}
        </div>
      )}
      <TimeInterval setSelectedTime={setSelectedTime} date={selectedDay} />
    </>
  );
};

export default TimePicker;
