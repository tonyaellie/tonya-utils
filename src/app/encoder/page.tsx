import type { Metadata } from 'next';

import Encoder from './Encoder';

export const metadata: Metadata = {
  title: 'Encoder',
  description: 'Encode text in the most overcomplicated way.',
};

const EncoderPage = () => {
  return <Encoder />;
};

export default EncoderPage;
