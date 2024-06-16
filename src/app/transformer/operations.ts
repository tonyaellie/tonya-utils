export const operationNames = [
  'base64_encode',
  'base64_decode',
  'binary_encode_ascii',
  'binary_decode_ascii',
  'binary_encode',
  'binary_decode',
  'reverse',
] as const;

export const operations = new Map<
  (typeof operationNames)[number],
  (inputstring: string) => string
>();

operations.set('base64_encode', (inputstring) =>
  Buffer.from(inputstring).toString('base64')
);
operations.set('base64_decode', (inputstring) =>
  Buffer.from(inputstring, 'base64').toString()
);
operations.set('binary_encode_ascii', (inputstring) =>
  inputstring
    .split('')
    .map((char) => {
      const charCode = char.charCodeAt(0);
      return charCode.toString(2).padStart(8, '0');
    })
    .join(' ')
);
operations.set('binary_decode_ascii', (inputstring) =>
  inputstring
    .split(' ')
    .map((binary) => {
      return parseInt(binary, 2);
    })
    .join('')
);
operations.set('binary_encode', (inputstring) =>
  inputstring
    .split('')
    .map((char) => char.replace(/\n/g, ' '))
    .filter((char) => char.match(/[0-9 ]/))
    .join('')
    .split(' ')
    .map((number) => {
      return (Number(number) >> 0).toString(2);
    })
    .join(' ')
);
operations.set('binary_decode', (inputstring) =>
  inputstring
    .split('')
    .map((char) => char.replace(/\n/g, ' '))
    .filter((char) => char.match(/[0-1 ]/))
    .join('')
    .split(' ')
    .map((binary) => {
      return parseInt(binary, 2);
    })
    .join('')
);
operations.set('reverse', (inputstring) =>
  inputstring.split('').reverse().join('')
);
