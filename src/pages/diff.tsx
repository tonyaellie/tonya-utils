import { type NextPage } from 'next';
import { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import Layout from '../components/Layout';

const Diff: NextPage = () => {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');

  return (
    <Layout title="Diff" description="Find the different in two bits of text.">
      <div>
        <textarea
          value={oldText}
          onChange={(e) => setOldText(e.target.value)}
          style={{ width: '100%', height: '100px' }}
        />
        char count: {oldText.length}
      </div>
      <div>
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          style={{ width: '100%', height: '100px' }}
        />
        count: {newText.length}
      </div>

      <ReactDiffViewer
        oldValue={oldText}
        newValue={newText}
        useDarkTheme={true}
      />
    </Layout>
  );
};

export default Diff;
