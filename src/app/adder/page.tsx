import type { Metadata } from 'next';

import Adder from './Adder';

export const metadata: Metadata = {
  title: 'Adder',
  description: 'Adds numbers.',
};

const AdderPage = () => {
  return <Adder />;
};

export default AdderPage;
