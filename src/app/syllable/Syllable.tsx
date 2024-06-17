'use client';

import { useState } from 'react';

import { syllable } from 'syllable';

import { AutosizeTextarea } from '@/components/ui/autosize-textarea';

const Syllable = () => {
  const [text, setText] = useState('');

  return (
    <div className="flex gap-4">
      <div className="mt-[9px] flex flex-col">
        {text.split('\n').map((line, index) => (
          <div key={index} className="text-sm">
            {syllable(line).toString().padStart(2, '0')}
          </div>
        ))}
      </div>
      <AutosizeTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        minHeight={200}
        className="h-[200px] w-full"
      />
    </div>
  );
};

export default Syllable;
