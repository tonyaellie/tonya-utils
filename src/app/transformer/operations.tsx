import type { FC } from 'react';

import config from 'next/config';
import { defaultConfig } from 'next/dist/server/config-shared';

export type OperationConfigProps<TConfig> = {
  config: TConfig;
  onChange: (config: TConfig) => void;
};

export type Operation<TConfig = undefined> = TConfig extends undefined
  ? {
      execute: (inputString: string) => string;
    }
  : {
      defaultConfig: TConfig;
      ConfigComponent: FC<OperationConfigProps<TConfig>>;
      execute: (inputString: string, config: TConfig) => string;
    };

export const operationNames = [
  'base64_encode',
  'base64_decode',
  'binary_encode_ascii',
  'binary_decode_ascii',
  'binary_encode',
  'binary_decode',
  'reverse',
  'ceaser_cipher',
] as const;

export const operations = new Map<
  (typeof operationNames)[number],
  Operation<any>
>();

operations.set('base64_encode', {
  execute: (inputstring) => Buffer.from(inputstring).toString('base64'),
} satisfies Operation);
operations.set('base64_decode', {
  execute: (inputstring) => Buffer.from(inputstring, 'base64').toString(),
} satisfies Operation);
operations.set('binary_encode_ascii', {
  execute: (inputstring) =>
    inputstring
      .split('')
      .map((char) => {
        const charCode = char.charCodeAt(0);
        return charCode.toString(2).padStart(8, '0');
      })
      .join(' '),
} satisfies Operation);
operations.set('binary_decode_ascii', {
  execute: (inputstring) =>
    inputstring
      .split(' ')
      .map((binary) => {
        return parseInt(binary, 2);
      })
      .join(''),
} satisfies Operation);
operations.set('binary_encode', {
  execute: (inputstring) =>
    inputstring
      .split('')
      .map((char) => char.replace(/\n/g, ' '))
      .filter((char) => char.match(/[0-9 ]/))
      .join('')
      .split(' ')
      .map((number) => {
        return (Number(number) >> 0).toString(2);
      })
      .join(' '),
} satisfies Operation);
operations.set('binary_decode', {
  execute: (inputstring) =>
    inputstring
      .split('')
      .map((char) => char.replace(/\n/g, ' '))
      .filter((char) => char.match(/[0-1 ]/))
      .join('')
      .split(' ')
      .map((binary) => {
        return parseInt(binary, 2);
      })
      .join(''),
} satisfies Operation);
operations.set('reverse', {
  execute: (inputstring) => inputstring.split('').reverse().join(''),
} satisfies Operation);
operations.set('ceaser_cipher', {
  defaultConfig: {
    shift: 0,
  },
  ConfigComponent: ({ config, onChange }) => {
    return (
      <div>
        <input
          type="number"
          value={config.shift}
          onChange={(e) =>
            onChange({ ...config, shift: parseInt(e.target.value) })
          }
        />
      </div>
    );
  },
  execute: (inputstring, config) => {
    const { shift } = config;
    const key = 'abcdefghijklmnopqrstuvwxyz';
    return inputstring
      .split('')
      .map((char) => {
        const charCode = char.charCodeAt(0);
        return String.fromCharCode(
          ((charCode + shift) % key.length) + key.charCodeAt(0)
        );
      })
      .join('');
  },
} as Operation<{
  shift: number;
}>);
