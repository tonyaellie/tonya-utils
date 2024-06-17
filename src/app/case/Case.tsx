'use client';

import { useState } from 'react';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const doNotCapitalize = [
  'a',
  'and',
  'as',
  'at',
  'but',
  'by',
  'down',
  'for',
  'from',
  'if',
  'in',
  'into',
  'like',
  'near',
  'nor',
  'of',
  'off',
  'on',
  'once',
  'onto',
  'or',
  'over',
  'past',
  'so',
  'than',
  'that',
  'to',
  'upon',
  'when',
  'with',
  'yet',
];

const toTitleCase = (string: string) => {
  return string
    .split(' ')
    .filter((word) => word)
    .map((word) =>
      doNotCapitalize.includes(word)
        ? word
        : word[0]?.toUpperCase() + word.slice(1)
    )
    .join(' ');
};

const removeDashes = (string: string) => {
  return string.replace(/-/g, ' ');
};

const Case = () => {
  const [string, setString] = useState('');
  const [shouldRemoveDashes, setRemoveDashes] = useState(true);

  // show in title case, lowercase, uppercase
  return (
    <div className="flex flex-col gap-2">
      <Textarea value={string} onChange={(e) => setString(e.target.value)} />
      <div className="flex items-center gap-2 font-bold">
        Remove dashes?
        <Checkbox
          className="size-5"
          checked={shouldRemoveDashes}
          onCheckedChange={(e) => setRemoveDashes(e === true)}
        />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  shouldRemoveDashes
                    ? toTitleCase(removeDashes(string))
                    : toTitleCase(string)
                );
                toast.success('Copied to clipboard!');
              } catch (error) {
                console.error(error);
                toast.error('Failed to copy to clipboard!');
              }
            }}
          >
            <Copy />
          </Button>
          Title case:
        </div>
        <div className="mt-2">
          {shouldRemoveDashes
            ? toTitleCase(removeDashes(string))
            : toTitleCase(string)}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  shouldRemoveDashes
                    ? removeDashes(string).toLowerCase()
                    : string.toLowerCase()
                );
                toast.success('Copied to clipboard!');
              } catch (error) {
                console.error(error);
                toast.error('Failed to copy to clipboard!');
              }
            }}
          >
            <Copy />
          </Button>
          Lowercase:
        </div>
        <div className="mt-2">
          {shouldRemoveDashes
            ? removeDashes(string).toLowerCase()
            : string.toLowerCase()}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  shouldRemoveDashes
                    ? removeDashes(string).toUpperCase()
                    : string.toUpperCase()
                );
                toast.success('Copied to clipboard!');
              } catch (error) {
                console.error(error);
                toast.error('Failed to copy to clipboard!');
              }
            }}
          >
            <Copy />
          </Button>
          Uppercase:
        </div>
        <div className="mt-2">
          {shouldRemoveDashes
            ? removeDashes(string).toUpperCase()
            : string.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Case;
