'use client';

import { useState } from 'react';

// TODO: add support for other cases

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

  return (
    <div className="flex flex-col gap-2">
      <input
        value={string}
        onChange={(e) => setString(e.target.value)}
        className="rounded border border-primary-500 bg-amethyst-2 px-2 py-1 focus:outline-none"
      />
      <span className="font-bold">
        {string ? toTitleCase(removeDashes(string)) : 'Enter a string'}
      </span>
    </div>
  );
};

export default Case;
