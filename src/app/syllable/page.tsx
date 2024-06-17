import type { Metadata } from 'next';

import Syllable from './Syllable';

export const metadata: Metadata = {
  title: 'Syllable',
  description: 'Count the number of syllables in a given piece of text.',
};

const SyllablePage = () => {
  return <Syllable />;
};

export default SyllablePage;
