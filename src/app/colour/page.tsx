import type { Metadata } from 'next';

import Colour from './Colour';

export const metadata: Metadata = {
  title: 'Colour',
  description: 'Pick colours.',
};

const ColourPage = () => {
  return <Colour />;
};

export default ColourPage;
