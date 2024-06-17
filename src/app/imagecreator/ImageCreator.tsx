'use client';

import { useEffect, useState } from 'react';

import {
  ClipboardPaste,
  Copy,
  Dices,
  Eraser,
  FlipHorizontal,
  FlipVertical,
  PaintBucket,
  Pencil,
  Redo2,
  RotateCcw,
  RotateCw,
  Undo2,
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// TODO:
//  - hotkeys
//  - export and import?

const NumberInput = ({
  value,
  setValue,
  min,
  max,
  id,
  hidden,
}: {
  value: number;
  setValue: (value: number) => void;
  min?: number;
  max?: number;
  id: string;
  hidden?: boolean;
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
    <Input
      hidden={hidden}
      id={id}
      type="number"
      value={internalValue}
      onChange={onChange}
      className={hidden ? 'hidden' : ''}
    />
  );
};

const CopyText = ({ text, hidden }: { text: string; hidden?: boolean }) => {
  return (
    <div
      hidden={hidden}
      className="m-2 cursor-pointer break-words hover:underline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          toast.success('Copied to clipboard!');
        } catch (error) {
          console.error(error);
          toast.error('Failed to copy to clipboard!');
        }
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
  image: number[][]
) => {
  const area = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0)
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
  area: number[][],
  image: number[][]
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
  image: number[][],
  direction: 'left' | 'right'
) => {
  if (width !== height) return image;

  const area = getArea(x, y, width, height, image);
  const newArea = Array.from({ length: width }, () =>
    Array.from({ length: height }, () => 0)
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
  image: number[][],
  direction: 'horizontal' | 'vertical'
) => {
  const area = getArea(x, y, width, height, image);
  const newArea = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0)
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
  image: number[][]
) => {
  const newImage = image.map((row) => [...row]);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) newImage[y + i]![x + j] = 0;
  }
  return newImage;
};

const invertArea = (
  x: number,
  y: number,
  width: number,
  height: number,
  image: number[][]
) => {
  const newImage = image.map((row) => [...row]);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++)
      newImage[y + i]![x + j] = 255 - newImage[y + i]![x + j]!;
  }
  return newImage;
};

const randomiseArea = (
  x: number,
  y: number,
  width: number,
  height: number,
  image: number[][]
) => {
  const newImage = image.map((row) => [...row]);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++)
      newImage[y + i]![x + j] = Math.random() > 0.5 ? 255 : 0;
  }
  return newImage;
};

// TODO: add greyScale option so line is not as harsh
const drawLine = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  brightness: number,
  image: number[][]
) => {
  const newImage = image.map((row) => [...row]);
  const dx = Math.abs(endX - startX);
  const dy = Math.abs(endY - startY);
  const sx = startX < endX ? 1 : -1;
  const sy = startY < endY ? 1 : -1;
  let err = dx - dy;

  while (true) {
    newImage[startY]![startX] = brightness;
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
  image: number[][]
) => {
  const newImage = image.map((row) => [...row]);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (i === 0 || i === height - 1 || j === 0 || j === width - 1)
        newImage[y + i]![x + j] = 255;
    }
  }

  return newImage;
};

const drawCircle = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  image: number[][],
  greyScale: boolean
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

      if (Math.abs(distanceToCenter - radius) < (greyScale ? 0.8 : 0.5)) {
        if (greyScale) {
          newImage[i]![j] =
            255 - Math.floor(Math.abs(distanceToCenter - radius) * 255);
        } else {
          newImage[i]![j] = 255;
        }
      }
    }
  }

  return newImage;
};

const fillFromPoint = (
  x: number,
  y: number,
  image: number[][],
  originalColor: number,
  newColor: number
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
    image: number[][];
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
      Array.from({ length: width }, () => 0)
    );
    return initialStates;
  });
  const [history, setHistory] = useState<number[][][]>([image]);
  const [historyIndex, setHistoryIndex] = useState(0); // counted backwards, the higher the number the further back in history
  const [name, setName] = useState('');
  const [selectedSavedImage, setSelectedSavedImage] = useState<string>();
  const [greyScale, setGreyScale] = useState(false);
  const [currentColour, setCurrentColour] = useState(255); // 0 = black, 255 = white

  const [localStorageKeys, setLocalStorageKeys] = useState<string[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage);
    setLocalStorageKeys(keys);
  }, []);

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
        greyScale,
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
        image: z.array(z.array(z.number().min(0).max(255))),
        greyScale: z.boolean(),
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
    setGreyScale(data.data.greyScale);
    setName(selectedSavedImage);
  };

  const addHistory = (newImage: number[][]) => {
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
      greyScale ? currentColour : 255,
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => 0)
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
        if (
          image[newHeight + i]
            // check if any pixels bigger than 0
            ?.reduce((acc, curr) => acc + curr, 0) !== 0
        )
          return;
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
            Array.from({ length: width }, () => 0)
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
          if (image[i]![newWidth + j] !== 0) return;
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
          ...Array.from({ length: newWidth - width }, () => 0),
        ]);
      }
      return addHistory(prevImage.map((row) => row.slice(0, newWidth)));
    });
    setWidth(newWidth);
  };

  return (
    <div className="w-full">
      <div className="m-2 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="width">Width:</Label>
            <NumberInput
              id="width"
              value={width}
              setValue={setWidthChange}
              min={1}
              max={100}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="height">Height:</Label>
            <NumberInput
              id="height"
              value={height}
              setValue={setHeightChanges}
              min={1}
              max={100}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="offSetX">OffSetX:</Label>
            <NumberInput
              id="offSetX"
              value={offSetX}
              setValue={setOffSetX}
              min={-width}
              max={width}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="offSetY">OffSetY:</Label>
            <NumberInput
              id="offSetY"
              value={offSetY}
              setValue={setOffSetY}
              min={-height}
              max={height}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label hidden={!greyScale} htmlFor="colour">
              Colour:
            </Label>
            <NumberInput
              hidden={!greyScale}
              id="colour"
              value={currentColour}
              setValue={setCurrentColour}
              min={0}
              max={255}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Label htmlFor="greyScale">Greyscale:</Label>
          <Checkbox
            id="greyScale"
            checked={greyScale}
            onCheckedChange={(checked) => {
              if (checked) {
                setGreyScale(true);
              } else {
                // check that there are no pixels with a value other than 0 or 255
                if (
                  image
                    .map((row) => row.filter((col) => col !== 0 && col !== 255))
                    .filter((row) => row.length > 0).length > 0
                ) {
                  if (
                    confirm(
                      'This will convert all pixels that are not 0 or 255 to 255. Are you sure you want to continue?'
                    )
                  ) {
                    setImage(
                      image.map((row) =>
                        row.map((col) => (col === 0 || col === 255 ? col : 255))
                      )
                    );
                    setGreyScale(false);
                  } else {
                    return;
                  }
                }
                setGreyScale(false);
              }
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Select
            onValueChange={(value) => {
              setName(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an Image" />
            </SelectTrigger>
            <SelectContent>
              {localStorageKeys
                .filter((key) => key.includes('savedImage-'))
                .map((key) => key.replace('savedImage-', ''))
                .map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              loadImage();
            }}
          >
            Load Image
          </Button>

          <Input
            placeholder="File Name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <Button
            variant="outline"
            onClick={() => {
              saveImage();
            }}
          >
            Save Image
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              resetStarted();
              setSelectionStarted(true);
            }}
            className={`${selectionStarted ? 'bg-primary' : ''}`}
          >
            Start Selection
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setSelection(undefined);
              setSelectionStarted(false);
            }}
          >
            Clear Selection
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (history.length - historyIndex > 1) {
                setImage(history[history.length - historyIndex - 2]!);
                setHistoryIndex(historyIndex + 1);
              }
            }}
          >
            <Undo2 />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (historyIndex > 0) {
                setImage(history[history.length - historyIndex]!);
                setHistoryIndex(historyIndex - 1);
              }
            }}
          >
            <Redo2 />
          </Button>

          <Button
            variant="outline"
            size="icon"
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
          >
            <Copy />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (copied) {
                resetStarted();
                setPasteStarted(true);
              }
            }}
            className={`${pasteStarted ? 'bg-primary-950' : 'bg-amethyst-1'}`}
          >
            <ClipboardPaste />
          </Button>

          <Button
            variant="outline"
            size="icon"
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
          >
            <Eraser />
          </Button>

          <Button
            variant="outline"
            size="icon"
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
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M480-120q-133 0-226.5-92.5T160-436q0-66 25-122t69-100l226-222 226 222q44 44 69 100t25 122q0 131-93.5 223.5T480-120Zm0-80v-568L310-600q-35 33-52.5 74.5T240-436q0 97 70 166.5T480-200Z" />
            </svg>
          </Button>

          <Button
            variant="outline"
            size="icon"
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
          >
            <RotateCcw />
          </Button>

          <Button
            variant="outline"
            size="icon"
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
          >
            <RotateCw />
          </Button>

          <Button
            variant="outline"
            size="icon"
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
          >
            <FlipHorizontal />
          </Button>

          <Button
            variant="outline"
            size="icon"
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
          >
            <FlipVertical />
          </Button>

          <Button
            variant="outline"
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
          >
            Rect
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              if (selection && selection.width && selection.height) {
                setImage(
                  addHistory(
                    drawCircle(
                      selection.x,
                      selection.y,
                      selection.x + selection.width,
                      selection.y + selection.height,
                      image,
                      greyScale
                    )
                  )
                );
              } else {
                setImage(
                  addHistory(drawCircle(0, 0, width, height, image, greyScale))
                );
              }
            }}
          >
            Circle
          </Button>

          <Button
            variant="outline"
            size="icon"
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
          >
            <Dices />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              resetStarted();
              setLineStarted(true);
            }}
            className={`${lineStarted ? 'bg-primary' : ''}`}
          >
            <Pencil />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              resetStarted();
              setFillStarted(true);
            }}
            className={`${fillStarted ? 'bg-primary' : ''}`}
          >
            <PaintBucket />
          </Button>
        </div>
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
                style={{
                  backgroundColor: greyScale
                    ? `rgb(${image[i]![j]}, ${image[i]![j]}, ${image[i]![j]})`
                    : undefined,
                }}
                key={`${i}-${j}`}
                className={`h-8 w-8 border-2 ${
                  !greyScale && image[i]![j] ? 'bg-primary' : 'bg-accent/60'
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
                  checked={image[i]![j] === 255}
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
                            drawLine(
                              lineStart.x,
                              lineStart.y,
                              j,
                              i,
                              greyScale ? currentColour : 255,
                              image
                            )
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
                            greyScale
                              ? currentColour
                              : image[i]![j] === 255
                              ? 0
                              : 255
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
                        return greyScale
                          ? currentColour
                          : col === 255
                          ? 0
                          : 255;
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
        text="uBit.display.setDisplayMode(DISPLAY_MODE_GREYSCALE);"
        hidden={!greyScale}
      />
      <CopyText
        text={`MicroBitImage myImage("${image
          .map((row) => row.join(','))
          .join('\\n')}\\n");`}
      />
      <CopyText
        text={`const uint8_t myImageData[] = {${image
          .map((row) => row.join(','))
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
