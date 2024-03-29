import { useEffect, useState } from 'react';

import Fireworks from '@fireworks-js/react';
import { type NextPage } from 'next';
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';

const Countdown: NextPage = () => {
  const router = useRouter();
  const { date, hideui, fullscreen } = router.query;

  const [countdown, setCountdown] = useState('Loading...');
  const [negative, setNegative] = useState(false);

  useEffect(() => {
    const endDate = new Date(date as string);
    const calculateCountdown = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      const absDiff = Math.abs(diff);

      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((absDiff / 1000 / 60) % 60);
      const seconds = Math.floor((absDiff / 1000) % 60);

      // if days are 0, don't show them
      const daysString = days > 0 ? `${days} days, ` : '';
      // if days and hours are 0, don't show them
      const hoursString = days > 0 || hours > 0 ? `${hours} hours, ` : '';
      // if days, hours and minutes are 0, don't show them
      const minutesString =
        days > 0 || hours > 0 || minutes > 0 ? `${minutes} minutes, ` : '';

      const sign = diff < 0 ? '-' : '';

      if (diff < 0 && !negative) {
        setNegative(true);
      }

      setCountdown(
        `${sign}${daysString}${hoursString}${minutesString}${seconds} seconds`
      );
    };
    calculateCountdown();
    const interval = setInterval(() => calculateCountdown(), 1000);
    return () => clearInterval(interval);
  }, [date]);

  const dateRegex = new RegExp(
    '^(\\d{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]).([0-9]{3})Z$'
  );
  if (typeof date !== 'string' || !dateRegex.test(date)) {
    return (
      <Layout title="Countdown" description="Counts down to a specified date.">
        Invalid date
      </Layout>
    );
  }

  // TODO: make big and centred
  // TODO: add button to hide all layout elements
  // TODO: add full screen work
  // TODO: make countdown date?

  return (
    <Layout
      title="Countdown"
      description="Counts down to a specified date."
      hideUi={!!hideui}
    >
      <div className="p-64 text-center text-5xl">
        {countdown}
        {negative && <Fireworks className="absolute inset-0" />}
      </div>
    </Layout>
  );
};

export default Countdown;
