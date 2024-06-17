'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// TODO: make pretty

const getRatio = (num1: number, num2: number) => {
  const gcd = (a: number, b: number): number => {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  };
  const divisor = gcd(num1, num2);
  return [num1 / divisor, num2 / divisor];
};

const Ratio = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const [ratio1, ratio2] = getRatio(num1 ?? 0, num2 ?? 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div>
          <Label htmlFor="num1">Number 1</Label>
          <Input
            id="num1"
            type="number"
            value={num1}
            onChange={(e) => setNum1(parseInt(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="num2">Number 2</Label>
          <Input
            id="num2"
            type="number"
            value={num2}
            onChange={(e) => setNum2(parseInt(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="multiplier">Multiplier</Label>
          <Input
            id="multiplier"
            type="number"
            min={1}
            value={multiplier}
            onChange={(e) => setMultiplier(parseInt(e.target.value))}
          />
        </div>
      </div>
      {(ratio1 || 0) * multiplier}:{(ratio2 || 0) * multiplier}
    </div>
  );
};

export default Ratio;
