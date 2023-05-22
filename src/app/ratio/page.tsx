import type { Metadata } from 'next';

import Ratio from './Ratio';

export const metadata: Metadata = {
  title: 'Ratio',
  description: 'Ratio calculator.',
};

const RatioPage = () => {
  return <Ratio />;
};

export default RatioPage;
