'use client';

import { useState } from 'react';

const Time = () => {
  // take two times and print the difference
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');

  return (
    <div className="flex flex-col gap-2">
      <input
        type="time"
        className="border-2 border-black"
        onChange={(e) => setTime1(e.target.value)}
        value={time1}
      />
      <input
        type="time"
        className="border-2 border-black"
        onChange={(e) => setTime2(e.target.value)}
        value={time2}
      />
      {time1 && time2 && (
        <div>
          {Math.floor(
            Math.abs(
              new Date(`1970-01-01T${time1}:00`) -
                new Date(`1970-01-01T${time2}:00`)
            ) / 36e5
          )}{' '}
          hours and{' '}
          {Math.floor(
            Math.abs(
              new Date(`1970-01-01T${time1}:00`) -
                new Date(`1970-01-01T${time2}:00`)
            ) / 6e4
          ) % 60}{' '}
          minutes
        </div>
      )}
    </div>
  );
};

export default Time;
