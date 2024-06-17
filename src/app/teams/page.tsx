import type { Metadata } from 'next';

import Teams from './Teams';

export const metadata: Metadata = {
  title: 'Teams Generator',
  description: 'Generate teams from a given list of names.',
};

const TeamsPage = () => {
  return <Teams />;
};

export default TeamsPage;
