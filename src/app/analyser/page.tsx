import type { Metadata } from 'next';

import Analyser from './Analyser';

export const metadata: Metadata = {
  title: 'Analyser',
  description:
    'Analyse text for things such as length, sentiment, language, etc.',
};

const AnalyserPage = () => {
  return <Analyser />;
};

export default AnalyserPage;
