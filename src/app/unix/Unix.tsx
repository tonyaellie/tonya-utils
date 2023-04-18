'use client';

import { useEffect, useState } from 'react';

const Unix = () => {
  const [unix, setUnix] = useState('');
  const [pasted, setPasted] = useState(false);

  useEffect(() => {
    navigator.clipboard.readText().then((text) => {
      if (
        !isNaN(parseInt(text)) &&
        text.length >= 10 &&
        text.length <= 15 &&
        text !== unix &&
        !pasted
      ) {
        setUnix(text);
        setPasted(true);
      }
    });
  }, [unix, pasted]);

  return (
    <>
      <input
        value={unix}
        onChange={(e) => setUnix(e.target.value)}
        className="w-48 rounded border border-primary-500 bg-amethyst-2 px-2 py-1 focus:outline-none"
      />
      {unix && (
        <p>
          {new Date(parseInt(unix)).getFullYear() === 1970
            ? new Date(parseInt(unix) * 1000).toUTCString()
            : new Date(parseInt(unix)).toUTCString()}
        </p>
      )}
    </>
  );
};

export default Unix;
