'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';

const Char = () => {
  const [string, setString] = useState('');
  const [index, setIndex] = useState<number>();

  return (
    <div className="flex flex-col gap-2">
      This does not use 0-indexing.
      <Input value={string} onChange={(e) => setString(e.target.value)} />
      <Input
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
      />
      <span className="font-bold">
        {index !== undefined ? string[index - 1] : 'Please enter a valid index'}
      </span>
    </div>
  );
};

export default Char;
