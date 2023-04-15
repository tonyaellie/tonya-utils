'use client';

import { useMemo, useState } from 'react';

import { type NextPage } from 'next';

// export const metadata = {
//   title: 'Counter',
//   description: 'Count stuff in text.',
// };

const Counter: NextPage = () => {
  const [text, setText] = useState('');
  const counts = useMemo(() => {
    const lines = text.split('\n');
    const words = text.split(/\s/);
    const chars = text.split('');
    return {
      lines: lines.length,
      words: words.length,
      chars: chars.length,
    };
  }, [text]);

  return (
    <>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%', height: '100px' }}
      />
      <div className="flex flex-col">
        <span>char count: {counts.chars}</span>
        <span>word count: {counts.words}</span>
        <span>line count: {counts.lines}</span>
        {
          // TODO: add individual word count and character count
        }
      </div>
    </>
  );
};

export default Counter;
