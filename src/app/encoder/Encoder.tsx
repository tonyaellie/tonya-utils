'use client';

import crypto from 'crypto';

import { useState, useMemo } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { type NextPage } from 'next';

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
    case 'md5':
      return crypto.createHash('md5').update(text).digest('hex');
    case 'sha1':
      return crypto.createHash('sha1').update(text).digest('hex');
    case 'sha256':
      return crypto.createHash('sha256').update(text).digest('hex');
    default:
      throw new Error(`Unsupported encoding type: ${encoder.type}`);
  }
};

const EncoderChain: React.FC<{
  encoders: Encoder[];
  setEncoders: (encoders: Encoder[]) => void;
  numberOfEncoders: number;
  setNumberOfEncoders: (numberOfEncoders: number) => void;
  startingText: string;
}> = ({
  encoders,
  setEncoders,
  numberOfEncoders,
  setNumberOfEncoders,
  startingText,
}) => {
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
        <div className="rounded-lg border-2 border-primary-500 bg-amethyst-1 p-2">
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
              <option value="md5">MD5</option>
              <option value="sha1">SHA1</option>
              <option value="sha256">SHA256</option>
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
                aria-label="Remove Encoder"
                className="h-4 w-4 rounded-full border-2 border-red-500 hover:bg-red-500"
                onClick={() => {
                  const newEncoderTypes = [...encoders];
                  newEncoderTypes.splice(
                    encoders.length - numberRemaining - 1,
                    1
                  );
                  setEncoders(newEncoderTypes);
                  setNumberOfEncoders(numberOfEncoders - 1);
                }}
              />
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
    <>
      <div className="flex flex-col space-y-2">
        <EncoderComponent
          text={startingText}
          numberRemaining={numberOfEncoders}
        />
      </div>
      <div className="h-2" />
      <button
        aria-label="Add chain"
        className="h-4 w-full rounded-lg border-2 border-green-600 bg-amethyst-2 hover:bg-green-600"
        onClick={handleAddEncoder}
      />
    </>
  );
};

const Encoder: NextPage = () => {
  const [animationParent] = useAutoAnimate();

  const [text, setText] = useState('');
  const [chainsNumberOfEncoders, setChainsNumberOfEncoders] = useState<
    number[]
  >([0]);
  const [chainsEncoders, setChainsEncoders] = useState<Encoder[][]>([
    [
      {
        type: 'base64',
      },
    ],
  ]);

  return (
    <>
      <textarea
        id="text"
        value={text}
        className="h-32 w-full rounded-lg border-2 border-primary-500 bg-amethyst-2 p-4 focus:outline-none"
        onChange={(event) => setText(event.target.value)}
      />
      <div className="flex flex-col space-y-2" ref={animationParent}>
        {chainsEncoders.map((chainEncoders, chainIndex) => (
          <div
            key={chainIndex}
            className="flex flex-col rounded-lg border-2 border-primary-500 bg-amethyst-2 p-1"
          >
            <EncoderChain
              encoders={chainEncoders}
              setEncoders={(encoders) => {
                const newChainsEncoders = [...chainsEncoders];
                newChainsEncoders[chainIndex] = encoders;
                setChainsEncoders(newChainsEncoders);
              }}
              numberOfEncoders={chainsNumberOfEncoders[chainIndex] || 0}
              setNumberOfEncoders={(numberOfEncoders) => {
                const newChainsNumberOfEncoders = [...chainsNumberOfEncoders];
                newChainsNumberOfEncoders[chainIndex] = numberOfEncoders;
                setChainsNumberOfEncoders(newChainsNumberOfEncoders);
              }}
              startingText={text}
            />
            {chainsEncoders.length > 1 && (
              <>
                <div className="h-2" />
                <button
                  aria-label="Remove chain"
                  className="h-4 w-full rounded-lg border-2 border-red-600 bg-amethyst-2 hover:bg-red-600"
                  onClick={() => {
                    const newChainsEncoders = [...chainsEncoders];
                    newChainsEncoders.splice(chainIndex, 1);
                    setChainsEncoders(newChainsEncoders);
                    const newChainsNumberOfEncoders = [
                      ...chainsNumberOfEncoders,
                    ];
                    newChainsNumberOfEncoders.splice(chainIndex, 1);
                    setChainsNumberOfEncoders(newChainsNumberOfEncoders);
                  }}
                />
              </>
            )}
          </div>
        ))}
        <button
          aria-label="Add chain"
          className="h-4 w-full rounded-lg border-2 border-green-600 bg-amethyst-2 hover:bg-green-600"
          onClick={() => {
            setChainsEncoders([...chainsEncoders, [{ type: 'base64' }]]);
            setChainsNumberOfEncoders([...chainsNumberOfEncoders, 0]);
          }}
        />
      </div>
    </>
  );
};

export default Encoder;
