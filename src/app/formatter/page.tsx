import type { Metadata } from 'next';

import Formatter from './Formatter';

export const metadata: Metadata = {
  title: 'Formatter',
  description: 'Format code.',
};

const FormatterPage = () => {
  return <Formatter />;
};

export default FormatterPage;
