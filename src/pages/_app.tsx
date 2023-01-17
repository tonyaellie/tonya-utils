// import localFont from '@next/font/local';
import { type AppType } from 'next/app';

import { trpc } from '../utils/trpc';

import '../styles/globals.css';

// const virgil = localFont({ src: '../styles/Virgil.woff2', variable: '--font-virgil' });

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(MyApp);
