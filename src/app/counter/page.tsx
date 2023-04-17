import type { Metadata } from 'next';

import Counter from './Counter';

export const metadata: Metadata = {
  title: 'Counter',
  description: 'Count stuff in text.',
};

const CounterPage = () => {
  return <Counter />;
};

export default CounterPage;
