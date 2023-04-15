import Link from 'next/link';

import Toastify from './Toastify';

import '../styles/globals.css';

const RootLayout = ({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) => {
  const hideUi = false;

  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <body>
        <Toastify />
        <div className="mx-auto min-h-screen justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-blue-400 antialiased">
          {!hideUi && (
            <header className="top-0 z-50 mb-4">
              <Link href="/" className="border p-1 hover:text-blue-600">
                Home
              </Link>
              <span className="px-1" />
              <span className="p-1 font-bold">{'TODO: REPLACE ME'}</span>
            </header>
          )}
          <main>{children}</main>
          {!hideUi && (
            <footer className="flex justify-center">
              <Link
                className="pr-2 underline"
                href="https://github.com/tonyaellie/tonya-utils"
              >
                {`© Copyright ${new Date().getFullYear()} Tonya's Utils Contributors`}
              </Link>
            </footer>
          )}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
