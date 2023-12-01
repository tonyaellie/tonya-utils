'use client';

import { useState } from 'react';

import { z } from 'zod';

// TODO:
//  - add support for greyscale
//  - hotkeys
//  - export and import?

const NumberInput = ({
  value,
  setValue,
  min,
  max,
  id,
}: {
  value: number;
  setValue: (value: number) => void;
  min?: number;
  max?: number;
  id: string;
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
      id={id}
      type="text"
      value={internalValue}
      onChange={onChange}
      className="rounded-md border-2 border-primary-500 px-1"
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

const getArea = (
  x: number,
  y: number,
  width: number,
  height: number,
  image: boolean[][]
) => {
  const area = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) area[i]![j] = image[y + i]![x + j]!;
  }
  return area;
};

const pasteArea = (
  x: number,
  y: number,
  width: number,
  height: number,
  area: boolean[][],
  image: boolean[][]
) => {
  const newImage = image.map((row) => [...row]);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) newImage[y + i]![x + j] = area[i]![j]!;
  }
  return newImage;
};

const rotateArea = (
  x: number,
  y: number,
  width: number,
  height: number,
  image: boolean[][],
  direction: 'left' | 'right'
) => {
  if (width !== height) return image;

  const area = getArea(x, y, width, height, image);
  const newArea = Array.from({ length: width }, () =>
    Array.from({ length: height }, () => false)
  );
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++)
      newArea[j]![i] =
        direction === 'left'
          ? area[i]![width - j - 1]!
          : area[height - i - 1]![j]!;
  }
  return pasteArea(x, y, width, height, newArea, image);
};

const flipArea = (
  x: number,
  y: number,
  width: number,
  height: number,
  image: boolean[][],
  direction: 'horizontal' | 'vertical'
) => {
  const area = getArea(x, y, width, height, image);
  const newArea = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++)
      newArea[i]![j] =
        direction === 'horizontal'
          ? area[i]![width - j - 1]!
          : area[height - i - 1]![j]!;
  }
  return pasteArea(x, y, width, height, newArea, image);
};

const clearArea = (
  x: number,
  y: number,
  width: number,
  height: number,
  image: boolean[][]
) => {
  const newImage = image.map((row) => [...row]);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) newImage[y + i]![x + j] = false;
  }
  return newImage;
};

const invertArea = (
  x: number,
  y: number,
  width: number,
  height: number,
  image: boolean[][]
) => {
  const newImage = image.map((row) => [...row]);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++)
      newImage[y + i]![x + j] = !newImage[y + i]![x + j];
  }
  return newImage;
};

const randomiseArea = (
  x: number,
  y: number,
  width: number,
  height: number,
  image: boolean[][]
) => {
  const newImage = image.map((row) => [...row]);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++)
      newImage[y + i]![x + j] = Math.random() > 0.5;
  }
  return newImage;
};

const drawLine = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  image: boolean[][]
) => {
  const newImage = image.map((row) => [...row]);
  const dx = Math.abs(endX - startX);
  const dy = Math.abs(endY - startY);
  const sx = startX < endX ? 1 : -1;
  const sy = startY < endY ? 1 : -1;
  let err = dx - dy;

  while (true) {
    newImage[startY]![startX] = true;
    if (startX === endX && startY === endY) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      startX += sx;
    }
    if (e2 < dx) {
      err += dx;
      startY += sy;
    }
  }

  return newImage;
};

const drawRectangle = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  image: boolean[][]
) => {
  const newImage = image.map((row) => [...row]);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (i === 0 || i === height - 1 || j === 0 || j === width - 1)
        newImage[y + i]![x + j] = true;
    }
  }

  return newImage;
};

const drawCircle = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  image: boolean[][]
) => {
  const newImage = image.map((row) => [...row]);
  const width = Math.abs(endX - startX) - 1;
  const height = Math.abs(endY - startY) - 1;

  if (width !== height) return image;
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);

  const radius = Math.min(width, height) / 2;

  const centerX = x + width / 2;
  const centerY = y + height / 2;

  for (let i = y; i < y + height + 1; i++) {
    for (let j = x; j < x + width + 1; j++) {
      const distanceToCenter = Math.sqrt(
        Math.pow(centerX - j, 2) + Math.pow(centerY - i, 2)
      );

      if (Math.abs(distanceToCenter - radius) < 0.5) {
        newImage[i]![j] = true;
      }
    }
  }

  return newImage;
};

const fillFromPoint = (
  x: number,
  y: number,
  image: boolean[][],
  originalColor: boolean,
  newColor: boolean
) => {
  const newImage = image.map((row) => [...row]);
  if (newImage[y]![x] !== originalColor) return newImage;

  const queue = [{ x, y }];

  while (queue.length > 0) {
    const { x, y } = queue.pop()!;
    newImage[y]![x] = newColor;

    if (y > 0 && newImage[y - 1]![x] === originalColor)
      queue.push({ x, y: y - 1 });
    if (y < newImage.length - 1 && newImage[y + 1]![x] === originalColor)
      queue.push({ x, y: y + 1 });
    if (x > 0 && newImage[y]![x - 1] === originalColor)
      queue.push({ x: x - 1, y });
    if (x < newImage[0]!.length - 1 && newImage[y]![x + 1] === originalColor)
      queue.push({ x: x + 1, y });
  }

  return newImage;
};

const ImageCreator = () => {
  const [height, setHeight] = useState(5);
  const [width, setWidth] = useState(5);
  const [offSetX, setOffSetX] = useState(0);
  const [offSetY, setOffSetY] = useState(0);
  const [copied, setCopied] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    image: boolean[][];
  }>();
  const [pasteStarted, setPasteStarted] = useState(false);
  const [lineStart, setLineStart] = useState<{
    x: number;
    y: number;
  }>();
  const [lineStarted, setLineStarted] = useState(false);

  const [selection, setSelection] = useState<{
    x: number;
    y: number;
    width?: number;
    height?: number;
  }>();
  const [selectionStarted, setSelectionStarted] = useState(false);

  const [fillStarted, setFillStarted] = useState(false);

  const [currentHoveredPixel, setCurrentHoveredPixel] = useState<{
    x: number;
    y: number;
  }>();

  const [image, setImage] = useState(() => {
    const initialStates = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => false)
    );
    return initialStates;
  });
  const [history, setHistory] = useState<boolean[][][]>([image]);
  const [historyIndex, setHistoryIndex] = useState(0); // counted backwards, the higher the number the further back in history
  const [name, setName] = useState('');
  const [selectedSavedImage, setSelectedSavedImage] = useState<string>();

  const saveImage = () => {
    if (
      localStorage.getItem(`savedImage-${name}`) &&
      !confirm('Are you sure you want to overwrite this image?')
    )
      return;

    localStorage.setItem(
      `savedImage-${name}`,
      JSON.stringify({
        height,
        width,
        offSetX,
        offSetY,
        image,
      })
    );
  };

  const loadImage = () => {
    console.log(selectedSavedImage);
    if (!selectedSavedImage) return;
    const savedImage = localStorage.getItem(`savedImage-${selectedSavedImage}`);
    if (!savedImage) return;

    if (
      !confirm(
        'Are you sure you want to load this image? This will overwrite your current image.'
      )
    )
      return;

    const parsedImage = JSON.parse(savedImage);
    const data = z
      .object({
        height: z.number(),
        width: z.number(),
        offSetX: z.number(),
        offSetY: z.number(),
        image: z.array(z.array(z.boolean())),
      })
      .safeParse(parsedImage);

    if (!data.success) {
      alert('Error loading image');
      console.error(data.error);
      return;
    }

    setHeight(data.data.height);
    setWidth(data.data.width);
    setOffSetX(data.data.offSetX);
    setOffSetY(data.data.offSetY);
    setImage(data.data.image);
    setHistory([data.data.image]);
    setName(selectedSavedImage);
  };

  const addHistory = (newImage: boolean[][]) => {
    if (historyIndex !== 0) {
      setHistory(history.slice(historyIndex));
      setHistoryIndex(0);
    }
    setHistory((prevHistory) => [...prevHistory, newImage]);
    return newImage;
  };

  const resetStarted = () => {
    setSelectionStarted(false);
    setSelection(undefined);
    setLineStarted(false);
    setLineStart(undefined);
    setFillStarted(false);
    setPasteStarted(false);
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

  const inPendingSelection = (x: number, y: number) => {
    if (!selectionStarted || !selection || !currentHoveredPixel) return false;

    const topLeft = {
      x: Math.min(selection.x, currentHoveredPixel.x),
      y: Math.min(selection.y, currentHoveredPixel.y),
    };

    const bottomRight = {
      x: Math.max(selection.x, currentHoveredPixel.x),
      y: Math.max(selection.y, currentHoveredPixel.y),
    };

    return (
      x >= topLeft.x &&
      x < bottomRight.x + 1 &&
      y >= topLeft.y &&
      y < bottomRight.y + 1
    );
  };

  const inPendingLine = (x: number, y: number) => {
    if (!lineStarted || !lineStart || !currentHoveredPixel) return false;
    const pendingLine = drawLine(
      lineStart.x,
      lineStart.y,
      currentHoveredPixel.x,
      currentHoveredPixel.y,
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false)
      )
    );
    return pendingLine[y]![x];
  };

  const inPendingPaste = (x: number, y: number) =>
    pasteStarted &&
    copied &&
    currentHoveredPixel &&
    x >= currentHoveredPixel.x &&
    x < currentHoveredPixel.x + copied.width &&
    y >= currentHoveredPixel.y &&
    y < currentHoveredPixel.y + copied.height;

  const setHeightChanges = (newHeight: number) => {
    if (newHeight < height) {
      for (let i = 0; i < height - newHeight; i++) {
        if (image[newHeight + i]?.includes(true)) return;
        if (
          selection &&
          selection.width &&
          selection.height &&
          selection.y + selection.height > newHeight
        )
          setSelection(undefined);
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
      return addHistory(prevImage.slice(0, newHeight));
    });
    setHeight(newHeight);
  };

  const setWidthChange = (newWidth: number) => {
    if (newWidth < width) {
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width - newWidth; j++) {
          if (image[i]![newWidth + j]) return;
          if (
            selection &&
            selection.width &&
            selection.height &&
            selection.x + selection.width > newWidth
          )
            setSelection(undefined);
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
      return addHistory(prevImage.map((row) => row.slice(0, newWidth)));
    });
    setWidth(newWidth);
  };

  return (
    <div className="w-full rounded-lg border-2 border-primary-500">
      <div className="m-2 grid grid-cols-2 gap-2">
        <label htmlFor="width">Width:</label>
        <NumberInput
          id="width"
          value={width}
          setValue={setWidthChange}
          min={1}
          max={100}
        />
        <label htmlFor="height">Height:</label>
        <NumberInput
          id="height"
          value={height}
          setValue={setHeightChanges}
          min={1}
          max={100}
        />
        <label htmlFor="offSetX">OffSetX:</label>
        <NumberInput
          id="offSetX"
          value={offSetX}
          setValue={setOffSetX}
          min={-width}
          max={width}
        />
        <label htmlFor="offSetY">OffSetY:</label>
        <NumberInput
          id="offSetY"
          value={offSetY}
          setValue={setOffSetY}
          min={-height}
          max={height}
        />

        <select
          value={selectedSavedImage}
          onChange={(e) => {
            setSelectedSavedImage(e.target.value);
          }}
          className="rounded-md border-2 border-primary-500 px-1"
        >
          <option hidden value="">
            Select Image
          </option>
          {Object.keys(localStorage)
            .filter((key) => key.includes('savedImage-'))
            .map((key) => key.replace('savedImage-', ''))
            .map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
        </select>

        <button
          onClick={() => {
            loadImage();
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Load Image
        </button>

        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="rounded-md border-2 border-primary-500 px-1"
        />

        <button
          onClick={() => {
            saveImage();
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Save Image
        </button>

        <button
          onClick={() => {
            resetStarted();
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
            if (history.length - historyIndex > 1) {
              setImage(history[history.length - historyIndex - 2]!);
              setHistoryIndex(historyIndex + 1);
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Undo
        </button>

        <button
          onClick={() => {
            if (historyIndex > 0) {
              setImage(history[history.length - historyIndex]!);
              setHistoryIndex(historyIndex - 1);
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Redo
        </button>

        <button
          onClick={() => {
            if (selection && selection.width && selection.height) {
              const area = getArea(
                selection.x,
                selection.y,
                selection.width,
                selection.height,
                image
              );
              setCopied({
                x: selection.x,
                y: selection.y,
                width: selection.width,
                height: selection.height,
                image: area,
              });
            } else {
              setCopied({
                x: 0,
                y: 0,
                width,
                height,
                image,
              });
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Copy
        </button>

        <button
          onClick={() => {
            if (copied) {
              resetStarted();
              setPasteStarted(true);
            }
          }}
          className={`rounded-md border-2 border-primary-500 px-2 ${
            pasteStarted ? 'bg-primary-950' : 'bg-amethyst-1'
          }`}
        >
          Paste
        </button>

        <button
          onClick={() => {
            if (selection && selection.width && selection.height) {
              setImage(
                addHistory(
                  clearArea(
                    selection.x,
                    selection.y,
                    selection.width,
                    selection.height,
                    image
                  )
                )
              );
            } else {
              setImage(addHistory(clearArea(0, 0, width, height, image)));
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Clear
        </button>

        <button
          onClick={() => {
            if (selection && selection.width && selection.height) {
              setImage(
                addHistory(
                  invertArea(
                    selection.x,
                    selection.y,
                    selection.width,
                    selection.height,
                    image
                  )
                )
              );
            } else {
              setImage(addHistory(invertArea(0, 0, width, height, image)));
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Invert
        </button>

        <button
          onClick={() => {
            if (selection && selection.width && selection.height) {
              setImage(
                addHistory(
                  rotateArea(
                    selection.x,
                    selection.y,
                    selection.width,
                    selection.height,
                    image,
                    'left'
                  )
                )
              );
            } else {
              setImage(
                addHistory(rotateArea(0, 0, width, height, image, 'left'))
              );
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Rotate Left
        </button>

        <button
          onClick={() => {
            if (selection && selection.width && selection.height) {
              setImage(
                addHistory(
                  rotateArea(
                    selection.x,
                    selection.y,
                    selection.width,
                    selection.height,
                    image,
                    'right'
                  )
                )
              );
            } else {
              setImage(
                addHistory(rotateArea(0, 0, width, height, image, 'right'))
              );
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Rotate Right
        </button>

        <button
          onClick={() => {
            if (selection && selection.width && selection.height) {
              setImage(
                addHistory(
                  flipArea(
                    selection.x,
                    selection.y,
                    selection.width,
                    selection.height,
                    image,
                    'horizontal'
                  )
                )
              );
            } else {
              setImage(
                addHistory(flipArea(0, 0, width, height, image, 'horizontal'))
              );
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Flip Horizontal
        </button>

        <button
          onClick={() => {
            if (selection && selection.width && selection.height) {
              setImage(
                addHistory(
                  flipArea(
                    selection.x,
                    selection.y,
                    selection.width,
                    selection.height,
                    image,
                    'vertical'
                  )
                )
              );
            } else {
              setImage(
                addHistory(flipArea(0, 0, width, height, image, 'vertical'))
              );
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Flip Vertical
        </button>

        <button
          onClick={() => {
            if (selection && selection.width && selection.height) {
              setImage(
                addHistory(
                  drawRectangle(
                    selection.x,
                    selection.y,
                    selection.x + selection.width,
                    selection.y + selection.height,
                    image
                  )
                )
              );
            } else {
              setImage(addHistory(drawRectangle(0, 0, width, height, image)));
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Draw Rectangle
        </button>

        <button
          onClick={() => {
            if (selection && selection.width && selection.height) {
              setImage(
                addHistory(
                  drawCircle(
                    selection.x,
                    selection.y,
                    selection.x + selection.width,
                    selection.y + selection.height,
                    image
                  )
                )
              );
            } else {
              setImage(addHistory(drawCircle(0, 0, width, height, image)));
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Draw Circle
        </button>

        <button
          onClick={() => {
            if (selection && selection.width && selection.height) {
              setImage(
                addHistory(
                  randomiseArea(
                    selection.x,
                    selection.y,
                    selection.width,
                    selection.height,
                    image
                  )
                )
              );
            } else {
              setImage(addHistory(randomiseArea(0, 0, width, height, image)));
            }
          }}
          className="rounded-md border-2 border-primary-500 px-2"
        >
          Randomise
        </button>

        <button
          onClick={() => {
            resetStarted();
            setLineStarted(true);
          }}
          className={`rounded-md border-2 border-primary-500 px-2 ${
            lineStarted ? 'bg-primary-950' : 'bg-amethyst-1'
          }`}
        >
          Draw Line
        </button>

        <button
          onClick={() => {
            resetStarted();
            setFillStarted(true);
          }}
          className={`rounded-md border-2 border-primary-500 px-2 ${
            fillStarted ? 'bg-primary-950' : 'bg-amethyst-1'
          }`}
        >
          Fill
        </button>
      </div>

      <div className="m-2 flex flex-col">
        {Array.from({ length: height }).map((_, i) => (
          <div key={i} className="flex flex-row">
            {Array.from({ length: width }).map((_, j) => (
              <label
                onMouseEnter={() => {
                  setCurrentHoveredPixel({
                    x: j,
                    y: i,
                  });
                }}
                onMouseLeave={() => {
                  setCurrentHoveredPixel(undefined);
                }}
                key={`${i}-${j}`}
                className={`h-8 w-8 border-2 ${
                  image[i]![j] ? 'bg-primary-500' : 'bg-gray-800'
                } ${
                  currentHoveredPixel?.x === j &&
                  currentHoveredPixel?.y === i &&
                  (selectionStarted ||
                    lineStarted ||
                    fillStarted ||
                    pasteStarted)
                    ? 'border-orange-600'
                    : inDisplay(j, i) &&
                      (inPendingSelection(j, i) ||
                        inPendingLine(j, i) ||
                        inPendingPaste(j, i))
                    ? 'border-green-900'
                    : inPendingSelection(j, i) ||
                      inPendingLine(j, i) ||
                      inPendingPaste(j, i)
                    ? 'border-green-500'
                    : inDisplay(j, i) && inSelection(j, i)
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
                  onChange={() => {
                    if (selectionStarted) {
                      if (!selection) {
                        setSelection({
                          x: j,
                          y: i,
                        });
                      } else {
                        setSelection({
                          ...selection,
                          x: Math.min(j, selection.x),
                          y: Math.min(i, selection.y),
                          width: Math.abs(j - selection.x) + 1,
                          height: Math.abs(i - selection.y) + 1,
                        });
                        setSelectionStarted(false);
                      }
                      return;
                    }
                    if (lineStarted) {
                      if (!lineStart) {
                        setLineStart({
                          x: j,
                          y: i,
                        });
                      } else {
                        setLineStart(undefined);
                        setLineStarted(false);
                        setImage(
                          addHistory(
                            drawLine(lineStart.x, lineStart.y, j, i, image)
                          )
                        );
                      }
                      return;
                    }
                    if (fillStarted) {
                      setFillStarted(false);
                      setImage(
                        addHistory(
                          fillFromPoint(
                            j,
                            i,
                            image,
                            image[i]![j]!,
                            !image[i]![j]
                          )
                        )
                      );
                      return;
                    }
                    if (pasteStarted) {
                      if (
                        copied &&
                        copied.width &&
                        copied.height &&
                        (j + copied.width > width || i + copied.height > height)
                      )
                        return;

                      setImage((prevImage) => {
                        if (copied) {
                          return addHistory(
                            pasteArea(
                              j,
                              i,
                              copied.width,
                              copied.height,
                              copied.image,
                              prevImage
                            )
                          );
                        }
                        return prevImage;
                      });
                      setPasteStarted(false);
                      return;
                    }
                    const newImage = image.map((row, rowIndex) => {
                      if (rowIndex !== i) return row;
                      return row.map((col, colIndex) => {
                        if (colIndex !== j) return col;
                        return !col;
                      });
                    });
                    setImage(addHistory(newImage));
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
      <CopyText
        text={`uBit.display.image.paste(image, ${offSetX}, ${offSetY})`}
      />
    </div>
  );
};

export default ImageCreator;
