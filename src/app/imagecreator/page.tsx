import type { Metadata } from 'next';

import ImageCreator from './ImageCreator';

export const metadata: Metadata = {
  title: 'Micro:Bit Image Creator',
  description: 'Create images for the Micro:Bit in C++',
};

const ImageCreatorPage = () => {
  return <ImageCreator />;
};

export default ImageCreatorPage;
