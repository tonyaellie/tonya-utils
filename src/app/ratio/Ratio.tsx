'use client';

// TODO: make pretty

import { useState } from 'react';

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
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);

  const [ratio1, ratio2] = getRatio(num1, num2);

  return (
    <div>
      <div>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(parseInt(e.target.value))}
        />
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(parseInt(e.target.value))}
        />
        <input
          type="range"
          min={1}
          max={100}
          value={multiplier}
          onChange={(e) => setMultiplier(parseInt(e.target.value))}
        />
      </div>
      {(ratio1 || 0) * multiplier}:{(ratio2 || 0) * multiplier}
    </div>
  );
};

export default Ratio;
