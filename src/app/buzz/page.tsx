import type { Metadata } from 'next';

import Buzz from './Buzz';

export const metadata: Metadata = {
  title: 'Buzz',
  description: 'Crack the spelling bee.',
};

// TODO: Fix importing words.txt

const EncoderPage = async () => {
  // const words = (await readFile('~/src/app/buzz/words.txt'))
  // .toString()
  // .split('\n');
  const words = ['hello', 'world'];

  return <Buzz words={words} />;
};

export default EncoderPage;
