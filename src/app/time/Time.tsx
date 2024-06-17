'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Time = () => {
  // take two times and print the difference
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');

  const time2IsEarlier =
    +new Date(`1970-01-01T${time2}:00`) < +new Date(`1970-01-01T${time1}:00`);
  const hours = Math.floor(
    Math.abs(
      +new Date(`1970-01-01T${time1}:00`) - +new Date(`1970-01-01T${time2}:00`)
    ) / 36e5
  );
  const minutes =
    Math.floor(
      Math.abs(
        +new Date(`1970-01-01T${time1}:00`) -
          +new Date(`1970-01-01T${time2}:00`)
      ) / 6e4
    ) % 60;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="time1">Start Time</Label>
      <Input
        id="time1"
        type="time"
        onChange={(e) => setTime1(e.target.value)}
        value={time1}
      />
      <Label htmlFor="time2">End Time</Label>
      <Input
        id="time2"
        type="time"
        onChange={(e) => setTime2(e.target.value)}
        value={time2}
      />
      {time1 && time2 && (
        <div>
          Has a difference of{' '}
          {time2IsEarlier ? 23 - hours + (60 - minutes === 60 ? 1 : 0) : hours}{' '}
          hours and{' '}
          {time2IsEarlier ? (60 - minutes === 60 ? 0 : 60 - minutes) : minutes} minutes.
        </div>
      )}
    </div>
  );
};

export default Time;
