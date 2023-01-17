import Head from 'next/head';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  hideUi?: boolean;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  description,
  hideUi,
}) => {
  return (
    <>
      <Head>
        <title>{`Tonya's Utils - ${title}`}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          defer
          data-domain="utils.tokia.dev"
          data-api="/ingest/api/event"
          src="/ingest/js/script.js"
        />
      </Head>
      <ToastContainer position={toast.POSITION.TOP_RIGHT} theme="dark" />
      <div className="mx-auto min-h-screen justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-blue-400 antialiased">
        {!hideUi && (
          <header className="top-0 z-50 mb-4">
            <Link href="/" className="border p-1 hover:text-blue-600">
              Home
            </Link>
            <span className="px-1" />
            <span className="p-1 font-bold">{title}</span>
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
    </>
  );
};

export default Layout;
