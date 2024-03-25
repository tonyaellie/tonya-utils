import type { Metadata } from 'next';

import Transformer from './Transformer';

export const metadata: Metadata = {
  title: 'Transformer',
  description: 'Transform text in the most overcomplicated way.',
};

const TransformerPage = () => {
  return <Transformer />;
};

export default TransformerPage;
