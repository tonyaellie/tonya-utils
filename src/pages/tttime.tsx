import { type NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const TTTime: NextPage = () => {
  const [time, setTime] = useState('Loading...');

  const calculateTime = () => {
    // get the number of hours since 18:00:00 - 21/10/2020 UTC
    const now = new Date();
    const start = new Date('2020-10-21T18:00:00.000Z');
    const diff = now.getTime() - start.getTime();
    const hours = diff / (1000 * 60 * 60);

    // split by . pad first half with 0s at the start to 8 digits
    // pad second half with 0s at the end to 2 digits and take first 2
    const hoursString = hours
      .toString()
      .split('.')
      .map((part, index) => {
        if (index === 0) {
          return part.padStart(8, '0');
        }
        return part.padEnd(4, '0').slice(0, 4);
      })
      .join('');

    // this will break in about 11,000 years
    // YYYY/M/D HH:MM:SS
    // 0001/9/2 63:49:20
    const timeString = `${hoursString.slice(0, 4)}/${hoursString.slice(
      4,
      5
    )}/${hoursString.slice(5, 6)} ${hoursString.slice(
      6,
      8
    )}:${hoursString.slice(8, 10)}:${hoursString.slice(10, 12)}`;
    setTime(timeString);
  };

  useEffect(() => {
    calculateTime();
    const interval = setInterval(() => calculateTime(), 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout title="TTTime" description="Displays the current time in TTTime.">
      <div className="p-64 text-center text-8xl">{time}</div>
    </Layout>
  );
};

export default TTTime;
