'use client';

import { useState } from 'react';

import ReactDiffViewer from 'react-diff-viewer-continued';

const Diff = () => {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');

  return (
    <>
      <div className="mb-4 rounded-lg border-2 border-primary-500">
        <textarea
          className="h-48 w-full rounded-t-lg border-b-2 border-primary-500 bg-amethyst-2 p-4 focus:outline-none"
          value={oldText}
          onChange={(e) => setOldText(e.target.value)}
        />
        <div className="pb-2 pl-2">
          Characters {oldText.replace(/\n/g, '').length}
        </div>
        <textarea
          className="h-48 w-full border-y-2 border-primary-500 bg-amethyst-2 p-4 focus:outline-none"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <div className="pb-2 pl-2">
          Characters {newText.replace(/\n/g, '').length}
        </div>
      </div>

      <ReactDiffViewer
        oldValue={oldText}
        newValue={newText}
        useDarkTheme={true}
      />
    </>
  );
};

export default Diff;
