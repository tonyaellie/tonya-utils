import type { Metadata } from 'next';

import Diff from './Diff';

export const metadata: Metadata = {
  title: 'Diff',
  description: 'Find the different in two bits of text.',
};

const DiffPage = () => {
  return <Diff />;
};

export default DiffPage;
