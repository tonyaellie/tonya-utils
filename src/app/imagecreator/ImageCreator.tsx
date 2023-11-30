'use client';

import { useState } from 'react';

const NumberInput = ({
  value,
  setValue,
  min,
  max,
}: {
  value: number;
  setValue: (value: number) => void;
  min?: number;
  max?: number;
}) => {
  const [internalValue, setInternalValue] = useState(value.toString());
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^0-9-]/g, '');
    if (
      (cleanedValue[0] !== '-' && cleanedValue.includes('-')) ||
      cleanedValue.split('-').length > 2
    )
      return;

    const parsedValue = parseInt(cleanedValue);
    if (
      !isNaN(parsedValue) &&
      (min === undefined || parsedValue >= min) &&
      (max === undefined || parsedValue <= max)
    ) {
      setValue(parsedValue);
    }

    setInternalValue(cleanedValue);
  };
  return (
    <input
      type="text"
      value={internalValue}
      onChange={onChange}
      className="rounded-md border-2 border-primary-500"
    />
  );
};

const CopyText = ({ text }: { text: string }) => {
  return (
    <div
      className="m-2 cursor-pointer break-words"
      onClick={() => {
        navigator.clipboard.writeText(text);
      }}
    >
      {text}
    </div>
  );
};

const ImageCreator = () => {
  const [height, setHeight] = useState(5);
  const [width, setWidth] = useState(5);
  const [offSetX, setOffSetX] = useState(0);
  const [offSetY, setOffSetY] = useState(0);

  const [selection, setSelection] = useState<{
    x: number;
    y: number;
    width?: number;
    height?: number;
  }>();

  const [selectionStarted, setSelectionStarted] = useState(false);

  const [image, setImage] = useState(() => {
    const initialStates = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => false)
    );
    return initialStates;
  });

  const setHeightChanges = (newHeight: number) => {
    if (newHeight < height) {
      for (let i = 0; i < height - newHeight; i++) {
        if (image[newHeight + i]?.includes(true)) return;
      }
    }

    setImage((prevImage) => {
      if (newHeight > height) {
        return [
          ...prevImage,
          ...Array.from({ length: newHeight - height }, () =>
            Array.from({ length: width }, () => false)
          ),
        ];
      }
      return prevImage.slice(0, newHeight);
    });
    setHeight(newHeight);
  };

  const setWidthChange = (newWidth: number) => {
    if (newWidth < 5) return;

    if (newWidth < width) {
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width - newWidth; j++) {
          if (image[i]![newWidth + j]) return;
        }
      }
    }

    setImage((prevImage) => {
      if (newWidth > width) {
        return prevImage.map((row) => [
          ...row,
          ...Array.from({ length: newWidth - width }, () => false),
        ]);
      }
      return prevImage.map((row) => row.slice(0, newWidth));
    });
    setWidth(newWidth);
  };

  const inDisplay = (x: number, y: number) =>
    y >= -offSetY && y < -offSetY + 5 && x >= -offSetX && x < -offSetX + 5;

  const inSelection = (x: number, y: number) =>
    selection &&
    selection.width &&
    selection.height &&
    x >= selection.x &&
    x < selection.x + selection.width &&
    y >= selection.y &&
    y < selection.y + selection.height;

  return (
    <div className="w-full rounded-lg border-2 border-primary-500">
      <div className="grid grid-cols-2 m-2">
        <label htmlFor="height">Width:</label>
        <NumberInput value={width} setValue={setWidthChange} min={5} max={30} />
        <label htmlFor="width">Height:</label>
        <NumberInput
          value={height}
          setValue={setHeightChanges}
          min={5}
          max={30}
        />
        <label htmlFor="offSetX">OffSetX:</label>
        <NumberInput
          value={offSetX}
          setValue={setOffSetX}
          min={-width}
          max={width}
        />
        <label htmlFor="offSetY">OffSetY:</label>
        <NumberInput
          value={offSetY}
          setValue={setOffSetY}
          min={-height}
          max={height}
        />

        <button
          onClick={() => {
            setSelection(undefined);
            setSelectionStarted(true);
          }}
          className={`rounded-md border-2 border-primary-500 px-2 ${
            selectionStarted ? 'bg-primary-950' : 'bg-amethyst-1'
          }`}
        >
          Start Selection
        </button>

        <button
          onClick={() => {
            setSelection(undefined);
            setSelectionStarted(false);
          }}
          className={`rounded-md border-2 border-primary-500 px-2`}
        >
          Clear Selection
        </button>

        <button
          onClick={() => {
            if (selection && selection.width && selection.height) {
              setImage((prevImage) => {
                const newImage = [...prevImage];
                for (let i = 0; i < selection.height!; i++) {
                  for (let j = 0; j < selection.width!; j++) {
                    newImage[selection.y + i]![selection.x + j] = false;
                  }
                }
                return newImage;
              });
            } else {
              setImage((prevImage) =>
                prevImage.map((row) => row.map(() => false))
              );
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Clear
        </button>

        <button
          onClick={() => {
            if (selection && selection.width && selection.height) {
              setImage((prevImage) => {
                return prevImage.map((row, i) =>
                  row.map((val, j) => {
                    if (inSelection(j, i)) return !val;
                    return val;
                  })
                );
              });
            } else {
              setImage((prevImage) =>
                prevImage.map((row) => row.map((val) => !val))
              );
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Invert
        </button>
      </div>

      <div className="m-2 flex flex-col">
        {Array.from({ length: height }).map((_, i) => (
          <div key={i} className="flex flex-row">
            {Array.from({ length: width }).map((_, j) => (
              <label
                key={`${i}-${j}`}
                className={`h-8 w-8 border-2 ${
                  image[i]![j] ? 'bg-primary-500' : 'bg-gray-800'
                } ${
                  // check if within 5x5 from top left corner, offset by offSetX and offSetY
                  inDisplay(j, i) && inSelection(j, i)
                    ? 'border-blue-900'
                    : inDisplay(j, i)
                    ? 'border-primary-900'
                    : inSelection(j, i)
                    ? 'border-blue-500'
                    : 'border-amethyst-1'
                }`}
                htmlFor={`${i}-${j}-checkbox`}
              >
                <input
                  id={`${i}-${j}-checkbox`}
                  type="checkbox"
                  hidden
                  checked={image[i]![j]}
                  onChange={(e) => {
                    if (selectionStarted) {
                      if (!selection) {
                        setSelection({
                          x: j,
                          y: i,
                        });
                      } else {
                        setSelection({
                          ...selection,
                          width: j - selection.x + 1,
                          height: i - selection.y + 1,
                        });
                        setSelectionStarted(false);
                      }
                      return;
                    }
                    const newImage = image.map((row, rowIndex) => {
                      if (rowIndex !== i) return row;
                      return row.map((col, colIndex) => {
                        if (colIndex !== j) return col;
                        return !col;
                      });
                    });
                    setImage(newImage);
                  }}
                />
              </label>
            ))}
          </div>
        ))}
      </div>
      <CopyText
        text={`MicroBitImage myImage("${image
          .map((row) => row.map((col) => (col ? '255' : '0')).join(','))
          .join('\\n')}\\n");`}
      />
      <CopyText
        text={`const uint8_t myImageData[] = {${image
          .map((row) => row.map((col) => (col ? '255' : '0')).join(','))
          .join(',')}};`}
      />
      <CopyText
        text={`MicroBitImage myImage(${width}, ${height}, myImageData);`}
      />
      <div
        className="m-2 cursor-pointer break-words"
        onClick={() => {
          navigator.clipboard.writeText(
            `uBit.display.image.paste(image, ${offSetX}, ${offSetY})`
          );
        }}
      >
        {`uBit.display.image.paste(image, ${offSetX}, ${offSetY})`}
      </div>
    </div>
  );
};

export default ImageCreator;
