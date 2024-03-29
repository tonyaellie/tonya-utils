'use client';

import { useMemo, useState } from 'react';

const Counter = () => {
  const [text, setText] = useState('');
  const counts = useMemo(() => {
    const lines = text.split('\n');
    const words = text.replace(/\s\s+/g, ' ').split(/\s/);
    const chars = text.replace(/\n/g, '').split('');
    return {
      lines: lines.length,
      words: words.length,
      chars: chars.length,
    };
  }, [text]);

  return (
    <div className="w-full rounded-lg border-2 border-primary-500">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-64 w-full rounded-t-lg border-b-2 border-primary-500 bg-amethyst-2 p-4 focus:outline-none"
      />
      <div className="flex flex-row justify-around pb-2">
        <span className="w-32">Characters {counts.chars}</span>
        <span className="w-32">
          Words {counts.chars === 0 ? 0 : counts.words}
        </span>
        <span className="w-32">
          Lines {counts.chars === 0 ? 0 : counts.lines}
        </span>
        {
          // TODO: add individual word count and character count
        }
      </div>
    </div>
  );
};

export default Counter;
