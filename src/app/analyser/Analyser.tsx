'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { syllable } from 'syllable';
import { create } from 'zustand';

import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

// TODO: make more efficient e.g. offload calculations to worker, debounce updates
// TODO: hide or move copyright to bottom of page

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): ReturnType<T> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      result = callback(...args);
    }, waitFor);
    return result;
  };
};

const store = create<{
  lineToSentiment: Map<string, number>;
  getSentiment: (line: string) => number | undefined;
  setSentiment: (line: string, sentiment: number) => void;
}>((set, get) => ({
  lineToSentiment: new Map(),
  getSentiment: (line) => {
    if (get().lineToSentiment.has(line)) {
      return get().lineToSentiment.get(line)!;
    }
    return undefined;
  },
  setSentiment: (line, sentiment) => {
    set(({ lineToSentiment }) => ({
      lineToSentiment: new Map([...lineToSentiment]).set(line, sentiment),
    }));
  },
}));

const SyllableDisplay = ({ line }: { line: string }) => {
  const syllableCount = useMemo(() => {
    const syllableCount = store.getState().lineToSentiment.get(line);
    if (syllableCount) {
      return syllableCount.toString().padStart(3, '0');
    }
    const newSyllableCount = syllable(line);
    store.getState().setSentiment(line, newSyllableCount);
    return newSyllableCount.toString().padStart(3, '0');
  }, [line]);

  return (
    <div className="flex w-[calc(100%-2px)] break-words text-sm">
      <div>{syllableCount}</div>
      <div className="min-w-0 select-none whitespace-pre-wrap text-wrap text-transparent">
        {line}
      </div>
    </div>
  );
};

const Counter = () => {
  const [text, setText] = useState('');
  const workerRef = useRef<Worker>();

  const [counts, setCounts] = useState({
    chars: 0,
    words: 0,
    lines: 1,
    syllables: 0,
    sentiment: {
      score: 0,
      words: [] as string[],
      positive: [] as string[],
      negative: [] as string[],
    },
    readability: 'Standard',
  });

  useEffect(() => {
    workerRef.current = new Worker('/workers/analyser.js', {
      type: 'module',
    });
    workerRef.current.onmessage = (event) => {
      console.log('Worker message:', event.data);
      setCounts(event.data);
    };
    workerRef.current.onerror = (error) => {
      console.error('Worker error:', error);
    };
    return () => {
      if (workerRef.current) {
        console.log('Terminating worker');
        workerRef.current.terminate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedUpdate = useMemo(
    () =>
      debounce((text) => {
        const id = Math.random().toString();
        if (workerRef.current) {
          workerRef.current.postMessage({
            text,
            id,
          });
        }
        console.log('Worker sent');
      }, 100),
    []
  );

  useEffect(() => {
    debouncedUpdate(text);
  }, [text, debouncedUpdate]);

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

      <div className="relative flex">
        <div className="absolute mt-[9px] w-[calc(100%-40px)]">
          {text.split('\n').map((line, index) => (
            <SyllableDisplay line={line} key={index} />
          ))}
        </div>
        <div className="absolute left-[40px] w-[calc(100%-40px)]">
          <div className="absolute left-[13px] top-[9px] mr-[12px] whitespace-pre-wrap break-words bg-background text-sm text-transparent">
            {text.length < 10000 &&
              // TODO: find a way to make this work with large texts
              text.split(/([^a-zA-Z])/).map((word, i) =>
                counts.sentiment.words.includes(word.toLocaleLowerCase()) ? (
                  <span
                    key={`${i}-${word}`}
                    className={
                      counts.sentiment.positive.includes(
                        word.toLocaleLowerCase()
                      )
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
                ) : (
                  word
                )
              )}
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
