import timeZoned from '@/utils/timeZoned';
import {
  roundToNearestMinutes,
  addMinutes,
  isBefore,
  isAfter,
  subMinutes,
} from 'date-fns';
import { format } from 'date-fns-tz';
import React, { useEffect, useState } from 'react';

interface ITimeInterval {
  setShowCutsom?: (arg: boolean) => void;
  setSelectedTime: any;
  date: any;
}

const TimeInterval = ({
  setShowCutsom,
  setSelectedTime,
  date,
}: ITimeInterval) => {
  const [i15minIntervalsArray, set15minIntervalsArray] = useState([]);

  useEffect(() => {
    console.log('TODAY', date);

    if (date) {
      let arr = [];
      let time = roundToNearestMinutes(subMinutes(date.openTime, 15), {
        nearestTo: 15,
      });
      let i = 1;

      while (isBefore(time, date.closeTime)) {
        time = addMinutes(time, 15);
        i++;
        if (
          !isAfter(time, date.closeTime) &&
          !isBefore(time, date.openTime) &&
          isAfter(time, addMinutes(timeZoned(new Date()), 15))
        ) {
          arr.push({
            id: i,
            time: format(time, 'hh:mm aaa'),
          });
        } else {
          console.log('THIS IS AFTER');
        }
      }
      set15minIntervalsArray(arr);
    }
  }, [date]);

  const selectOnChange = (e) => {
    if (setShowCutsom && e.target.value === 'Custom') {
      setShowCutsom(true);
    } else {
      setSelectedTime(e.target.value);
    }
  };

  console.log('i15minIntervalsArray', i15minIntervalsArray);
  return (
    <select name="cars" id="cars" onChange={selectOnChange}>
      <option defaultValue="ASAP" defaultChecked value="ASAP">
        ASAP (+15min)
      </option>
      {setShowCutsom && <option value="Custom">Custom</option>}
      {i15minIntervalsArray.map((time) => (
        <option key={time.id} value={time.time}>
          {time.time}
        </option>
      ))}
    </select>
  );
};

export default TimeInterval;
