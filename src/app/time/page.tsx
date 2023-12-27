import type { Metadata } from 'next';

import Time from './Time';

export const metadata: Metadata = {
  title: 'Time Diff',
  description: 'Difference in time.',
};

const CasePage = () => {
  return <Time />;
};

export default CasePage;
