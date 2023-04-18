import type { Metadata } from 'next';

import Unix from './Unix';

export const metadata: Metadata = {
  title: 'Unix Timestamp',
  description: 'Convert to and from unix timestamps.',
};

const UnixPage = () => {
  return <Unix />;
};

export default UnixPage;
