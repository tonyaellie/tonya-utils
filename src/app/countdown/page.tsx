import type { Metadata } from 'next';

import Countdown from './Countdown';

export const metadata: Metadata = {
  title: 'Countdown',
  description:
    'Countdown to a specified date or for a specified amount of time.',
};

const CountdownPage = () => {
  return <Countdown />;
};

export default CountdownPage;
