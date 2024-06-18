'use client';

import { useState } from 'react';

// @ts-expect-error prettier is untyped
import prettierPluginHTML from 'prettier/parser-html';
// @ts-expect-error prettier is untyped
import prettierPluginTS from 'prettier/parser-typescript';
// @ts-expect-error prettier is untyped
import * as prettier from 'prettier/standalone';

import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Formatter = () => {
  const [text, setText] = useState('');
  const [parser, setParser] = useState('typescript');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          onClick={() => {
            try {
              const formattedText = prettier.format(text, {
                parser,
                plugins: [prettierPluginTS, prettierPluginHTML],
              });
              setText(formattedText);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          Format
        </Button>
        <Select
          value={parser}
          onValueChange={(newValue) => setParser(newValue)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AutosizeTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default Formatter;
