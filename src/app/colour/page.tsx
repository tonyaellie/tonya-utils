import { Suspense } from 'react';

import type { Metadata } from 'next';

import Colour from './Colour';

export const metadata: Metadata = {
  title: 'Colour',
  description: 'Pick colours.',
};

const ColourPage = () => {
  return (
    <Suspense>
      <Colour />
    </Suspense>
  );
};

export default ColourPage;
