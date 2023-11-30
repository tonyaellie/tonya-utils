import Link from 'next/link';
import NextTopLoader from 'nextjs-toploader';

import Toastify from './Toastify';

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

const RootLayout = ({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <body className="bg-amethyst-1 text-primary-500">
        <NextTopLoader color="#fa3aa6" />
        <Toastify />
        <div className="mx-auto min-h-screen justify-center antialiased">
          <header className="top-0 z-50 bg-amethyst-2 p-4">
            <Link
              href="/"
              className="rounded bg-primary-500 p-1 text-amethyst-2 hover:bg-primary-600"
            >
              Home
            </Link>
          </header>
          <main className="px-4 pt-4">{children}</main>
          <footer className="flex justify-center">
            <Link
              // make this be at bottom of scroll or bottom of screen whichever is lower
              className="pr-2 underline"
              href="https://github.com/tonyaellie/tonya-utils"
            >
              {`© Copyright ${new Date().getFullYear()} Tonya's Utils Contributors`}
            </Link>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
