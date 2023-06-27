'use client';

import { useState } from 'react';

const Char = () => {
  const [string, setString] = useState('');
  const [index, setIndex] = useState<number>();

  return (
    <div className='flex flex-col gap-2'>
      This does not use 0-indexing.
      <input
        value={string}
        onChange={(e) => setString(e.target.value)}
        className="w-48 rounded border border-primary-500 bg-amethyst-2 px-2 py-1 focus:outline-none"
      />
      <input
        value={index || ''}
        onChange={(e) => {
          console.log(e.target.value);
          if (e.target.value === '') {
            setIndex(undefined);
            return;
          }
          if (isNaN(Number(e.target.value))) {
            console.log('not a number');
            return;
          }
          if (Number(e.target.value) < 1) {
            console.log('negative');
            return;
          }
          if (Number(e.target.value) > string.length) {
            console.log('too big');
            return;
          }
          setIndex(Number(e.target.value));
        }}
        className="w-48 rounded border border-primary-500 bg-amethyst-2 px-2 py-1 focus:outline-none"
      />
      <span className="font-bold">
        {index !== undefined ? string[index - 1] : 'Please enter a valid index'}
      </span>
    </div>
  );
};

export default Char;
