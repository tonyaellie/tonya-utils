import type { Metadata } from 'next';

import Ucas from './Ucas';

export const metadata: Metadata = {
  title: 'UCAS Calculator',
  description: 'Calculate UCAS points.',
};

const UcasPage = () => {
  return (
    <>
      <Ucas />
    </>
  );
};

export default UcasPage;
