import type { Metadata } from 'next';

import Char from './Char';

export const metadata: Metadata = {
  title: 'Char Display',
  description: 'Gets char at index from string.',
};

const CharPage = () => {
  return <Char />;
};

export default CharPage;
