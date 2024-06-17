'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Qualification = {
  name: string;
  value: number;
  id: string;
};

// TODO: add option to save and have list of saved lists

const allQualification = [
  { name: 'A Level A*', value: 56, id: 'a-level-a-star' },
  { name: 'A Level A', value: 48, id: 'a-level-a' },
  { name: 'A Level B', value: 40, id: 'a-level-b' },
  { name: 'A Level C', value: 32, id: 'a-level-c' },
  { name: 'A Level D', value: 24, id: 'a-level-d' },
  { name: 'A Level E', value: 16, id: 'a-level-e' },
  { name: 'AS Level A', value: 20, id: 'as-level-a' },
  { name: 'AS Level B', value: 16, id: 'as-level-b' },
  { name: 'AS Level C', value: 12, id: 'as-level-c' },
  { name: 'AS Level D', value: 10, id: 'as-level-d' },
  { name: 'AS Level E', value: 6, id: 'as-level-e' },
  { name: 'EPQ A*', value: 28, id: 'epq-a-star' },
  { name: 'EPQ A', value: 24, id: 'epq-a' },
  { name: 'EPQ B', value: 20, id: 'epq-b' },
  { name: 'EPQ C', value: 16, id: 'epq-c' },
  { name: 'EPQ D', value: 12, id: 'epq-d' },
  { name: 'EPQ E', value: 8, id: 'epq-e' },
  {
    name: 'BTEC Level 3 National Diploma D*D*',
    value: 112,
    id: 'btec-level-3-national-diploma-d-star-d-star',
  },
  {
    name: 'BTEC Level 3 National Diploma D*D',
    value: 104,
    id: 'btec-level-3-national-diploma-d-star-d',
  },
  {
    name: 'BTEC Level 3 National Diploma DD',
    value: 96,
    id: 'btec-level-3-national-diploma-dd',
  },
  {
    name: 'BTEC Level 3 National Diploma DM',
    value: 80,
    id: 'btec-level-3-national-diploma-dm',
  },
  {
    name: 'BTEC Level 3 National Diploma MM',
    value: 64,
    id: 'btec-level-3-national-diploma-mm',
  },
  {
    name: 'BTEC Level 3 National Diploma MP',
    value: 48,
    id: 'btec-level-3-national-diploma-mp',
  },
  {
    name: 'BTEC Level 3 National Diploma PP',
    value: 31,
    id: 'btec-level-3-national-diploma-pp',
  },
  {
    name: 'NCFE Cache Technical Level 3 Extended Diploma in Health and Social Care A*',
    value: 84,
    id: 'ncfe-cache-technical-level-3-extended-diploma-in-health-and-social-care-a-star',
  },
  {
    name: 'NCFE Cache Technical Level 3 Extended Diploma in Health and Social Care A',
    value: 72,
    id: 'ncfe-cache-technical-level-3-extended-diploma-in-health-and-social-care-a',
  },
  {
    name: 'NCFE Cache Technical Level 3 Extended Diploma in Health and Social Care B',
    value: 60,
    id: 'ncfe-cache-technical-level-3-extended-diploma-in-health-and-social-care-b',
  },
  {
    name: 'NCFE Cache Technical Level 3 Extended Diploma in Health and Social Care C',
    value: 48,
    id: 'ncfe-cache-technical-level-3-extended-diploma-in-health-and-social-care-c',
  },
  {
    name: 'NCFE Cache Technical Level 3 Extended Diploma in Health and Social Care D',
    value: 36,
    id: 'ncfe-cache-technical-level-3-extended-diploma-in-health-and-social-care-d',
  },
];

const QualificationBox = ({
  qualifications,
  setQualifications,
  position,
}: {
  qualifications: Qualification[];
  setQualifications: Dispatch<SetStateAction<Qualification[]>>;
  position: number;
}) => {
  return (
    <div className="flex">
      <Select
        value={qualifications[position]!.id}
        onValueChange={(newValue) => {
          const newQualifications = [...qualifications];
          newQualifications[position] = {
            name: newValue,
            value:
              allQualification.find(
                (qualification) => qualification.id === newValue
              )?.value || 0,
            id: newValue,
          };
          setQualifications(newQualifications);
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="choose">Choose a qualification</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
          {allQualification.map((qualification) => (
            <SelectItem key={qualification.id} value={qualification.id}>
              {qualification.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="p-2" />
      {qualifications[position]!.id === 'custom' ? (
        <Input
          className="w-24"
          type="number"
          value={qualifications[position]!.value}
          onChange={(e) => {
            const newQualifications = [...qualifications];
            newQualifications[position] = {
              name: 'Custom',
              value: parseInt(e.target.value),
              id: 'custom',
            };
            setQualifications(newQualifications);
          }}
        />
      ) : (
        <span className="m-auto">{qualifications[position]!.value}</span>
      )}
      <div className="p-2" />
      <div>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            const newQualifications = [...qualifications];
            newQualifications.splice(position, 1);
            setQualifications(newQualifications);
          }}
        >
          <X />
        </Button>
      </div>
    </div>
  );
};

const qualificationsSchema = z.array(
  z.object({
    name: z.string(),
    value: z.number(),
    id: z.string(),
  })
);

const Ucas = () => {
  const params = useSearchParams();
  const [qualifications, setQualifications] = useState<Qualification[]>([
    { name: 'Choose a qualification', value: 0, id: 'choose' },
  ]);

  const [animationParent] = useAutoAnimate();

  useEffect(() => {
    if (params) {
      try {
        const data = params.get('data') || '[]';

        console.log(JSON.parse(data));

        // validate data using zod
        // technically abusable but eh
        const validatedData = qualificationsSchema.parse(JSON.parse(data));

        setQualifications(validatedData);
      } catch {
        toast.error('Invalid data');
      }
    }
  }, [params]);

  return (
    <>
      <div ref={animationParent} className="flex flex-col gap-2">
        {qualifications.map((_, index) => (
          <QualificationBox
            qualifications={qualifications}
            setQualifications={setQualifications}
            position={index}
            key={index}
          />
        ))}
      </div>
      <div className="my-4 text-xl">
        Total: {qualifications.reduce((a, b) => a + b.value, 0)}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            setQualifications([
              ...qualifications,
              { name: 'Choose a qualification', value: 0, id: 'choose' },
            ]);
          }}
        >
          Add qualification
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                `${
                  process.env.NODE_ENV === 'production'
                    ? // FIXME: url should not be hardcoded
                      'https://utils.tokia.dev'
                    : 'http://localhost:3000'
                }/ucas?data=${encodeURIComponent(
                  JSON.stringify(qualifications)
                )}`
              );
              toast.success('Copied to clipboard!');
            } catch (error) {
              console.error(error);
              toast.error('Failed to copy to clipboard!');
            }
          }}
        >
          Share
        </Button>
      </div>
    </>
  );
};

export default Ucas;
