'use client';

import { useReducer, useState } from 'react';

import Decimal from 'decimal.js-light';
import { ArrowUpFromLine, Delete, Trash } from 'lucide-react';
import dynamic from 'next/dynamic';
import { set, z } from 'zod';

import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const HistorySchema = z.array(z.array(z.string()));

const getHistory = () => {
  // get history from local storage
  const history = localStorage.getItem('history');
  if (!history) {
    return [];
  }
  return HistorySchema.parse(JSON.parse(history)).map((row) =>
    row.map((num) => new Decimal(num))
  );
};

const setHistory = (history: Decimal[][]) => {
  localStorage.setItem(
    'history',
    JSON.stringify(
      HistorySchema.parse(
        history.map((row) => row.map((num) => num.toString()))
      )
    )
  );
};

const Adder = () => {
  const [numbers, setNumbers] = useState<Decimal[]>([]);
  const [currentNumber, setCurrentNumber] = useState('');
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handlePress = (button: string) => {
    switch (button) {
      // if number
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '0':
        setCurrentNumber(currentNumber + button);
        break;

      case '.':
      case ',':
        if (!currentNumber.includes('.')) {
          setCurrentNumber(
            currentNumber.length === 0 ? '0.' : currentNumber + '.'
          );
        }
        break;
      case 'del':
        if (currentNumber.length === 0) {
          setNumbers(numbers.slice(0, -1));
          setCurrentNumber((numbers[numbers.length - 1] || '').toString());
        } else {
          setCurrentNumber(currentNumber.slice(0, -1));
        }
        break;
      case '+':
        const num = currentNumber
          .replace(/(\.[0]+)0+$/, (match) => match.replace(/0+$/, ''))
          .replace(/\.$/, '');
        if (num.length > 0 && num !== '0') {
          setNumbers([...numbers, new Decimal(num)]);
          setCurrentNumber('');
        }
        break;
      case 'save':
        {
          const num = currentNumber
            .replace(/(\.[0]+)0+$/, (match) => match.replace(/0+$/, ''))
            .replace(/\.$/, '');
          setHistory([
            ...getHistory(),
            num.length > 0 && num !== '0'
              ? [...numbers, new Decimal(num)]
              : numbers,
          ]);
          forceUpdate();
        }
        break;
      case 'clear':
        setNumbers([]);
        setCurrentNumber('');
        break;
      default:
        console.log('invalid button');
        break;
    }
  };

  return (
    <div className="flex max-w-sm flex-col gap-2">
      <AutosizeTextarea
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData
            .getData('text/plain')
            .replace(/[^0-9.+]/g, '');
          console.log(text);
          setNumbers([
            ...numbers,
            ...text
              .split('+')
              .filter((num) => num.length > 0)
              .map((num) => new Decimal(num)),
          ]);
        }}
        minHeight={1}
        value={
          numbers.map((num) => num.toString()).join(' + ') +
          (numbers.length === 0 ? '' : ' + ') +
          currentNumber
        }
        onKeyDown={(e) => {
          if (!((e.key === 'c' || e.key === 'v' || e.key === 'a') && e.ctrlKey)) {
            e.preventDefault();
          }
          if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            handlePress('del');
          }
          if (e.key === '+' || e.code === 'Space') {
            e.preventDefault();
            handlePress('+');
          }
          if (e.key.match(/^[0-9]$/)) {
            e.preventDefault();
            handlePress(e.key);
          }
          if (e.key === '.' || e.key === ',') {
            e.preventDefault();
            handlePress('.');
          }
        }}
      />
      <div className="flex gap-2">
        <Badge>
          Sum:{' '}
          {numbers
            .reduce((a, b) => a.plus(b), new Decimal(0))
            .plus(currentNumber || 0)
            .toString()}
        </Badge>
        <Badge>Num: {numbers.length + (currentNumber ? 1 : 0)}</Badge>
        <Badge>
          Mean:{' '}
          {numbers
            .reduce((a, b) => a.plus(b), new Decimal(0))
            .plus(currentNumber || 0)
            .div(numbers.length + (currentNumber ? 1 : 0))
            .toDecimalPlaces(2)
            .toString()}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={() => {
            handlePress('save');
            handlePress('clear');
          }}
          variant="destructive"
        >
          Clear
        </Button>
        <Button
          onClick={() => {
            handlePress('del');
          }}
          variant="destructive"
        >
          <Delete />
        </Button>
        <Button
          onClick={() => {
            handlePress('save');
          }}
        >
          Save
        </Button>
        <Button
          onClick={() => {
            handlePress('1');
          }}
          variant="outline"
        >
          1
        </Button>
        <Button
          onClick={() => {
            handlePress('2');
          }}
          variant="outline"
        >
          2
        </Button>
        <Button
          onClick={() => {
            handlePress('3');
          }}
          variant="outline"
        >
          3
        </Button>
        <Button
          onClick={() => {
            handlePress('4');
          }}
          variant="outline"
        >
          4
        </Button>
        <Button
          onClick={() => {
            handlePress('5');
          }}
          variant="outline"
        >
          5
        </Button>
        <Button
          onClick={() => {
            handlePress('6');
          }}
          variant="outline"
        >
          6
        </Button>
        <Button
          onClick={() => {
            handlePress('7');
          }}
          variant="outline"
        >
          7
        </Button>
        <Button
          onClick={() => {
            handlePress('8');
          }}
          variant="outline"
        >
          8
        </Button>
        <Button
          onClick={() => {
            handlePress('9');
          }}
          variant="outline"
        >
          9
        </Button>
        <Button
          onClick={() => {
            handlePress('.');
          }}
          variant="outline"
        >
          .
        </Button>
        <Button
          onClick={() => {
            handlePress('0');
          }}
          variant="outline"
        >
          0
        </Button>
        <Button
          onClick={() => {
            handlePress('+');
          }}
          variant="outline"
        >
          +
        </Button>
      </div>
      {getHistory()
        .toReversed()
        .map((row, index) => (
          <div key={index} className="flex flex-col gap-2">
            {row.join(' + ')}
            <div className="flex gap-2">
              <Badge variant="outline">
                Sum:{' '}
                {row.reduce((a, b) => a.plus(b), new Decimal(0)).toString()}
              </Badge>
              <Badge variant="outline">
                Num: {row.length}
              </Badge>
              <Badge variant="outline">
                Mean:{' '}
                {row
                  .reduce((a, b) => a.plus(b), new Decimal(0))
                  .div(row.length)
                  .toDecimalPlaces(2)
                  .toString()}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setHistory(getHistory().filter((_, i) => i !== getHistory().length - index - 1));
                  forceUpdate();
                }}
                variant="destructive"
                size="icon"
              >
                <Trash />
              </Button>
              <Button
                onClick={() => {
                  setNumbers(row);
                  setCurrentNumber('');
                }}
                size="icon"
              >
                <ArrowUpFromLine />
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default dynamic(() => Promise.resolve(Adder), {
  ssr: false,
});
