import { type NextPage } from 'next';
import Layout from '../components/Layout';

import { useState, useMemo } from 'react';

type Encoder = {
  type: string;
  config?: any;
};

const encodeText = (text: string, encoder: Encoder) => {
  switch (encoder.type) {
    case 'base64':
      return Buffer.from(text).toString('base64');
    case 'hex':
      return Buffer.from(text)
        .toString('hex')
        .replace(/(.{2})/g, encoder.config ? '$1 ' : '$1');
    case 'binary':
      return text
        .split('')
        .map((char) => {
          const charCode = char.charCodeAt(0);
          return charCode.toString(2).padStart(8, '0');
        })
        .join(' ');
    case 'caesercipher':
      if (!encoder.config) {
        return 'set shift amount';
      }
      return text
        .split('')
        .map((char) => {
          const charCode = char.charCodeAt(0);
          if (charCode >= 65 && charCode <= 90) {
            return String.fromCharCode(
              ((charCode - 65 + encoder.config) % 26) + 65
            );
          } else if (charCode >= 97 && charCode <= 122) {
            return String.fromCharCode(
              ((charCode - 97 + encoder.config) % 26) + 97
            );
          } else {
            return char;
          }
        })
        .join('');
    default:
      throw new Error(`Unsupported encoding type: ${encoder.type}`);
  }
};

const Encoder: NextPage = () => {
  const [text, setText] = useState('');
  const [numberOfEncoders, setNumberOfEncoders] = useState(0);
  const [encoders, setEncoders] = useState<Encoder[]>([
    {
      type: 'base64',
    },
  ]);

  const EncoderComponent: React.FC<{
    text: string;
    numberRemaining: number;
  }> = ({ text, numberRemaining }) => {
    const encoder = encoders[encoders.length - numberRemaining - 1];

    if (!encoder) {
      throw new Error(
        `No encoder type for numberRemaining: ${
          encoders.length - numberRemaining
        }`
      );
    }

    const encodedText = useMemo(
      () => encodeText(text, encoder),
      [text, encoder]
    );

    return (
      <>
        <div className="rounded border p-2">
          <div className="flex">
            <span>Encoding Type:</span>
            <span className="p-1" />
            <select
              id="encoding-type"
              value={encoder.type}
              onChange={(event) => {
                const newEncoderTypes = [...encoders];
                newEncoderTypes[encoders.length - numberRemaining - 1] = {
                  type: event.target.value,
                  config: event.target.value === 'caesercipher' ? 3 : undefined,
                };
                setEncoders(newEncoderTypes);
              }}
            >
              <option value="base64">Base64</option>
              <option value="hex">Hex</option>
              <option value="binary">Binary</option>
              <option value="caesercipher">Caeser Cipher</option>
            </select>
            <>
              <span className="p-1" />

              {encoder.type === 'caesercipher' && (
                <input
                  id="config"
                  type="number"
                  value={encoder.config}
                  onChange={(event) => {
                    const newEncoderTypes = [...encoders];
                    newEncoderTypes[encoders.length - numberRemaining - 1] = {
                      type: encoder.type,
                      config: parseInt(event.target.value),
                    };
                    setEncoders(newEncoderTypes);
                  }}
                />
              )}
              {encoder.type === 'hex' && (
                <input
                  id="config"
                  type="checkbox"
                  checked={encoder.config}
                  onChange={() => {
                    const newEncoderTypes = [...encoders];
                    newEncoderTypes[encoders.length - numberRemaining - 1] = {
                      type: encoder.type,
                      config: !encoder.config,
                    };
                    setEncoders(newEncoderTypes);
                  }}
                />
              )}
            </>
            <div className="flex-1" />
            {numberOfEncoders > 0 && (
              <button
                onClick={() => {
                  const newEncoderTypes = [...encoders];
                  newEncoderTypes.splice(
                    encoders.length - numberRemaining - 1,
                    1
                  );
                  setEncoders(newEncoderTypes);
                  setNumberOfEncoders(numberOfEncoders - 1);
                }}
              >
                Remove
              </button>
            )}
          </div>
          <span>Encoded:</span>
          <div className="break-words">{encodedText}</div>
        </div>
        {numberRemaining > 0 && (
          <EncoderComponent
            text={encodedText}
            numberRemaining={numberRemaining - 1}
          />
        )}
      </>
    );
  };

  const handleAddEncoder = () => {
    setNumberOfEncoders(numberOfEncoders + 1);
    setEncoders([
      ...encoders,
      {
        type: 'base64',
      },
    ]);
  };

  return (
    <Layout title="Encoder" description="Encode text.">
      <textarea
        id="text"
        value={text}
        style={{ width: '100%', height: '100px' }}
        onChange={(event) => setText(event.target.value)}
      />
      <div className="flex flex-col space-y-2">
        <EncoderComponent text={text} numberRemaining={numberOfEncoders} />
      </div>
      <button onClick={handleAddEncoder}>Add Encoder</button>
    </Layout>
  );
};

export default Encoder;
