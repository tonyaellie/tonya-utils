import { Suspense } from 'react';

import type { Metadata } from 'next';

import Ucas from './Ucas';

export const metadata: Metadata = {
  title: 'UCAS Calculator',
  description: 'Calculate UCAS points.',
};

const UcasPage = () => {
  return (
    <Suspense>
      <Ucas />
    </Suspense>
  );
};

export default UcasPage;
