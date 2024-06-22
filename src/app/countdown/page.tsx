import { Suspense } from 'react';

import type { Metadata } from 'next';

import Countdown from './Countdown';

export const metadata: Metadata = {
  title: 'Countdown',
  description:
    'Countdown to a specified date or for a specified amount of time.',
};

const CountdownPage = () => {
  return (
    <Suspense>
      <Countdown />
    </Suspense>
  );
};

export default CountdownPage;
