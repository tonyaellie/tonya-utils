import { Menu } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import NextTopLoader from 'nextjs-toploader';

import '@/styles/globals.css';

import { CommandSearch } from '@/components/commandSearch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/sonner';

const links: {
  name: string;
  href: string;
  description: string;
}[] = [
  {
    name: 'Home',
    href: '/',
    description: 'Home page.',
  },
  {
    name: 'Counter',
    href: '/counter',
    description: 'Count characters, words, or lines in a given piece of text.',
  },
  {
    name: 'Diff',
    href: '/diff',
    description: 'Find the different in two bits of text.',
  },
  {
    name: 'Transformer',
    href: '/transformer',
    description:
      'Transform text, such as base64 encoding using a node based tool.',
  },
  {
    name: 'TTTime',
    href: '/tttime',
    description: 'Displays the current time in TTTime.',
  },
  {
    name: 'UCAS',
    href: '/ucas',
    description: 'Calculate UCAS points from A-level grades.',
  },
  // TODO: reimplement
  // {
  //   name: 'Countdown',
  //   href: '/countdown',
  //   description: 'Countdown to a specified date.',
  // },
  {
    name: 'Passwords',
    href: '/passwords',
    description: 'Password generator.',
  },
  {
    // add ability to convert to unix time
    name: 'Unix',
    href: '/unix',
    description: 'Convert from unix time to a human-readable date and time.',
  },
  {
    name: 'Colour',
    href: '/colour',
    description: 'Pick colours.',
  },
  {
    name: 'Char Index',
    href: '/char',
    description: 'Get the char at a given index in a string.',
  },
  {
    name: 'Case Converter',
    href: '/case',
    description: 'Convert to title case, lowercase, or uppercase.',
  },
  {
    name: 'Image Creator',
    href: '/imagecreator',
    description: 'Create images for the Micro:Bit in C++',
  },
  {
    // TODO: support multi day
    name: 'Time',
    href: '/time',
    description: 'Time diff.',
  },
  {
    name: 'Ratio',
    href: '/ratio',
    description: 'Ratio calculator.',
  },
  {
    name: 'Teams Generator',
    href: '/teams',
    description: 'Generate teams from a given list of names.',
  },
].sort((a, b) => a.name.localeCompare(b.name));

const RootLayout = ({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <head>
        <Script
          defer
          data-domain="utils.tokia.dev"
          data-api="/ingest/api/event"
          src="/ingest/js/script.js"
        />
      </head>
      <body>
        <NextTopLoader color="#6d28d9" />
        <Toaster />
        <CommandSearch links={links} />

        <div className="mx-auto flex min-h-screen flex-col justify-center antialiased">
          <header className="top-0 z-50 flex items-center gap-4 p-4">
            <nav>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu />
                    <span className="sr-only">Open Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Utilities</SheetTitle>
                    <Separator />
                  </SheetHeader>
                  <div className="mt-2 flex h-[95%] flex-col gap-2 overflow-y-auto scrollbar scrollbar-track-card scrollbar-thumb-accent">
                    {links.map((link) => (
                      <SheetClose key={link.name} asChild>
                        <Link
                          href={link.href}
                          className="flex flex-col hover:underline"
                        >
                          <span>{link.name}</span>
                          <span className="text-muted-foreground">
                            {link.description}
                          </span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </nav>

            <Link
              href="/"
              className="text-lg font-bold text-primary hover:underline"
            >
              Home
            </Link>
          </header>
          <Separator />
          <main className="flex-grow px-4 pt-4">{children}</main>
          <footer className="flex justify-center">
            <Link
              // make this be at bottom of scroll or bottom of screen whichever is lower
              className="pb-2 pr-2 underline hover:text-muted-foreground"
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
