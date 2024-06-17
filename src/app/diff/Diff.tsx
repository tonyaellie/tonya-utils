'use client';

import { useState } from 'react';

import ReactDiffViewer from 'react-diff-viewer-continued';

import { Textarea } from '@/components/ui/textarea';

const Diff = () => {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');

  return (
    <>
      <div className="mb-4 rounded-lg border-2">
        <Textarea
          className="-2 h-48 w-full rounded-b-none rounded-t-lg border-x-0 border-b-2 border-t-0 p-4"
          value={oldText}
          onChange={(e) => setOldText(e.target.value)}
        />
        <div className="py-2 pl-2">
          Characters {oldText.replace(/\n/g, '').length}
        </div>
        <Textarea
          className="h-48 w-full rounded-none border-x-0 border-y-2 p-4"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <div className="py-2 pl-2">
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
