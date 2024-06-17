'use client';

import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Unix = () => {
  const [unix, setUnix] = useState(Math.floor(Date.now() / 1000).toString());
  const [date, setDate] = useState(new Date());
  const [pasted, setPasted] = useState(false);

  useEffect(() => {
    try {
      navigator.clipboard.readText().then((text) => {
        if (
          !isNaN(parseInt(text)) &&
          text.length >= 10 &&
          text.length <= 15 &&
          text !== unix &&
          !pasted
        ) {
          setUnix(text);
          setPasted(true);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [unix, pasted]);

  return (
    <div className="flex flex-col gap-2">
      <span>Unix to Date</span>
      <Input value={unix} onChange={(e) => setUnix(e.target.value)} />
      {unix && (
        <p>
          {new Date(parseInt(unix)).getFullYear() === 1970
            ? new Date(parseInt(unix) * 1000).toUTCString()
            : new Date(parseInt(unix)).toUTCString()}
        </p>
      )}
      <Separator />
      <span>Date to Unix</span>
      <DateTimePicker
        granularity="second"
        jsDate={date}
        onJsDateChange={(date) => setDate(date)}
      />
      {date && (
        <p>
          {date.getFullYear() === 1970 ? date.getTime() / 1000 : date.getTime()}
        </p>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(Unix), {
  ssr: false,
});
