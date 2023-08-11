'use client';

import { useMemo, useState } from 'react';

const Char = ({
  char,
  setChar,
}: {
  char: string;
  setChar: (char: string) => void;
}) => {
  return (
    <input
      type="text"
      value={char}
      onChange={(e) => {
        if (e.target.value.match(/^[a-z]$/i) || e.target.value === '') {
          setChar(e.target.value);
        }
      }}
    />
  );
};

const Buzz = ({ words }: { words: string[] }) => {
  const [char1, setChar1] = useState('');
  const [char2, setChar2] = useState('');
  const [char3, setChar3] = useState('');
  const [char4, setChar4] = useState('');
  const [char5, setChar5] = useState('');
  const [char6, setChar6] = useState('');
  const [char7, setChar7] = useState('');

  const letters = useMemo(() => {
    const chars = [char1, char2, char3, char4, char5, char6, char7];
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return letters.filter((letter) => !chars.includes(letter));
  }, [char1, char2, char3, char4, char5, char6, char7]);

  const safeWords = useMemo(() => {
    return words
      .filter(
        (word) =>
          word.includes(char1) &&
          word.split('').every((letter) => !letters.includes(letter))
      )
      .sort((a, b) => b.length - a.length)
      .filter((word) => word.length >= 4);
  }, [char1, letters, words]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="bg-red-500">
        <Char char={char1} setChar={setChar1} />
      </div>
      <Char char={char2} setChar={setChar2} />
      <Char char={char3} setChar={setChar3} />
      <Char char={char4} setChar={setChar4} />
      <Char char={char5} setChar={setChar5} />
      <Char char={char6} setChar={setChar6} />
      <Char char={char7} setChar={setChar7} />
      {safeWords.join(', ')}
    </div>
  );
};

export default Buzz;
