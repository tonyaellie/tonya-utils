import type { Metadata } from 'next';

import Buzz from './Buzz';

import { readFile } from 'fs/promises';

export const metadata: Metadata = {
  title: 'Buzz',
  description: 'Crack the spelling bee.',
};

const EncoderPage = async () => {
  const words = (
    await readFile('/home/tonya/tonya-utils/src/app/buzz/words.txt')
  )
    .toString()
    .split('\n');

  return <Buzz words={words} />;
};

export default EncoderPage;
