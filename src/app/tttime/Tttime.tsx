'use client';

import { useEffect, useState } from 'react';

import { type NextPage } from 'next';
import { TTTime } from 'tttime';

const TTTimePage: NextPage = () => {
  const [time, setTime] = useState('Loading...');

  useEffect(() => {
    const calculateTime = () => {
      setTime(new TTTime().toString('%Y/%m/%d %H:%M:%S'));
    };
    const interval = setInterval(() => calculateTime(), 100);
    return () => clearInterval(interval);
  }, []);

  return <div className="pt-64 text-center text-8xl">{time}</div>;
};

export default TTTimePage;
