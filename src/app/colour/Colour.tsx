'use client';

import { useCallback, useMemo, useState } from 'react';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';

const HexDisplay = ({ num }: { num: number }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      if (!searchParams) {
        return;
      }

      const params = new URLSearchParams(Array.from(searchParams));
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const [colour, setColour] = useState(() => {
    const colour = searchParams?.get(`colour${num}`);

    if (colour) {
      return `#${colour}`;
    }

    return '#000000';
  });

  const hex = useMemo(() => {
    return colour;
  }, [colour]);

  return (
    <label
      className="h-64 w-1/3 cursor-pointer"
      htmlFor={`colour${num}`}
      style={{ backgroundColor: hex }}
    >
      <input
        id={`colour${num}`}
        className="hidden"
        type="color"
        value={hex}
        onChange={(e) => {
          const hex = e.target.value;

          setColour(hex);

          router.push(
            pathname +
              '?' +
              createQueryString(`colour${num}`, hex.replace('#', ''))
          );
        }}
      />
    </label>
  );
};

const Colour = () => {
  return (
    <div className="w-full">
      <div className="flex flex-row justify-evenly">
        <HexDisplay num={1} />
        <HexDisplay num={2} />
        <HexDisplay num={3} />
      </div>
    </div>
  );
};

export default Colour;
