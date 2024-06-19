'use client';

import { useMemo, useState } from 'react';

import Sentiment from 'sentiment';
import { syllable } from 'syllable';
// @ts-expect-error text-readability is untyped
import rs from 'text-readability';

import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const sentiment = new Sentiment();

const Counter = () => {
  const [text, setText] = useState('');
  const counts = useMemo(() => {
    const lines = text.split('\n');
    const chars = text.replace(/\n/g, '').split('');
    const readability = rs.fleschReadingEase(text);

    console.log(sentiment.analyze(text));

    return {
      chars: chars.length,
      words: rs.lexiconCount(text),
      lines: lines.length,
      syllables: syllable(text),
      sentiment: sentiment.analyze(text),
      readability:
        readability > 90
          ? 'Very Easy'
          : readability > 80
          ? 'Easy'
          : readability > 70
          ? 'Fairly Easy'
          : readability > 60
          ? 'Standard'
          : readability > 50
          ? 'Fairly Difficult'
          : readability > 30
          ? 'Difficult'
          : 'Very Confusing',
    };
  }, [text]);

  return (
    <>
      <Table className="mx-auto mb-4 w-72">
        <TableBody>
          <TableRow>
            <TableCell>Characters</TableCell>
            <TableCell>{counts.chars}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Words</TableCell>
            <TableCell>{counts.words}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Lines</TableCell>
            <TableCell>{counts.lines}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Syllables</TableCell>
            <TableCell>{counts.syllables}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Sentiment</TableCell>
            <TableCell>{counts.sentiment.score}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Readability</TableCell>
            <TableCell>{counts.readability}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex gap-4">
        <div className="mt-[9px] flex flex-col">
          {text.split('\n').map((line, index) => (
            <div key={index} className="text-sm">
              {syllable(line).toString().padStart(2, '0')}
            </div>
          ))}
        </div>
        <div className="relative w-full">
          <div className="absolute left-[13px] top-[9px] whitespace-pre-wrap break-words text-sm text-transparent">
            {text.split(/([^a-zA-Z])/).map((word, i) => (
              <span
                key={`${i}-${word}`}
                className={
                  counts.sentiment.positive.includes(word.toLocaleLowerCase())
                    ? 'rounded-sm bg-green-900'
                    : counts.sentiment.negative.includes(
                        word.toLocaleLowerCase()
                      )
                    ? 'rounded-sm bg-red-900'
                    : ''
                }
              >
                {word}
              </span>
            ))}
          </div>
          <AutosizeTextarea
            className="absolute left-0 top-0 bg-transparent"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default Counter;
