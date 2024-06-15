import type { Metadata } from 'next';
import { Suspense } from 'react';

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
