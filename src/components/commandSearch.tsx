'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export const CommandSearch = ({
  links,
}: {
  links: { name: string; href: string; description: string }[];
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for a utility..." />
        <CommandList className="scrollbar scrollbar-track-card scrollbar-thumb-accent">
          <CommandEmpty>No results found.</CommandEmpty>
          {links.map((link) => (
            <CommandItem
              key={link.name}
              className="hover:cursor-pointer"
              asChild
              onSelect={() => {
                router.push(link.href);
                setOpen(false);
              }}
            >
              <Link
                onClick={() => {
                  setOpen(false);
                }}
                href={link.href}
                className="flex flex-col"
              >
                <span>{link.name}</span>
                <span className="text-muted-foreground">
                  {link.description}
                </span>
              </Link>
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
