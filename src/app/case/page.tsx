import type { Metadata } from 'next';

import Case from './Case';

export const metadata: Metadata = {
  title: 'Case Editor',
  description: 'Change the case of a sentence.',
};

const CasePage = () => {
  return <Case />;
};

export default CasePage;
