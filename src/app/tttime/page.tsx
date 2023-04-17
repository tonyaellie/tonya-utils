import type { Metadata } from 'next';

import Tttime from './Tttime';

export const metadata: Metadata = {
  title: 'TTTime',
  description: 'Displays the current time in TTTime.',
};

const TttimePage = () => {
  return (
    <>
      <Tttime />
    </>
  );
};

export default TttimePage;
