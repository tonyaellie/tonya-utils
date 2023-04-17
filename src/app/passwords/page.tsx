import type { Metadata } from 'next';

import Passwords from './Passwords';

export const metadata: Metadata = {
  title: 'Passwords',
  description: 'Password generator.',
};

const PasswordPage = () => {
  return <Passwords />;
};

export default PasswordPage;
