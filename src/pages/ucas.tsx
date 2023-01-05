import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { z } from 'zod';
import Layout from '../components/Layout';

type Qualification = {
  name: string;
  value: number;
  id: string;
};

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

const QualificationBox: React.FC<{
  qualifications: Qualification[];
  setQualifications: Dispatch<SetStateAction<Qualification[]>>;
  position: number;
}> = ({ qualifications, setQualifications, position }) => {
  return (
    <div className="flex">
      <select
        value={qualifications[position]!.id}
        onChange={(e) => {
          const newQualifications = [...qualifications];
          newQualifications[position] = {
            name: e.target.value,
            value:
              allQualification.find(
                (qualification) => qualification.id === e.target.value
              )?.value || 0,
            id: e.target.value,
          };
          setQualifications(newQualifications);
        }}
      >
        <option value="choose">Choose a qualification</option>
        <option value="custom">Custom</option>
        {allQualification.map((qualification) => (
          <option value={qualification.id} key={qualification.id}>
            {qualification.name}
          </option>
        ))}
      </select>
      <div className="p-2" />
      {qualifications[position]!.id === 'custom' ? (
        <input
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
        <span>{qualifications[position]!.value}</span>
      )}
      <div className="p-2" />
      <button
        onClick={() => {
          const newQualifications = [...qualifications];
          newQualifications.splice(position, 1);
          setQualifications(newQualifications);
        }}
      >
        Remove
      </button>
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

const Ucas: NextPage = () => {
  const router = useRouter();
  const [qualifications, setQualifications] = useState<Qualification[]>([
    { name: 'Choose a qualification', value: 0, id: 'choose' },
  ]);

  useEffect(() => {
    if (router.query.data) {
      const data = Buffer.from(router.query.data as string, 'base64').toString(
        'utf-8'
      );

      console.log(JSON.parse(data));

      // validate data using zod
      // technically abusable but eh
      const validatedData = qualificationsSchema.parse(JSON.parse(data));

      setQualifications(validatedData);
    }
  }, [router.query.data]);

  return (
    <Layout title="UCAS Calculator" description="Calculate UCAS points.">
      {qualifications.map((qualification, index) => (
        <QualificationBox
          qualifications={qualifications}
          setQualifications={setQualifications}
          position={index}
          key={index}
        />
      ))}
      <button
        onClick={() => {
          setQualifications([
            ...qualifications,
            { name: 'Choose a qualification', value: 0, id: 'choose' },
          ]);
        }}
      >
        Add qualification
      </button>
      <div>Total: {qualifications.reduce((a, b) => a + b.value, 0)}</div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(
            `${
              process.env.NODE_ENV === 'production'
                ? // FIXME: url should not be hardcoded
                  'https://utils.tokia.dev'
                : 'http://localhost:3000'
            }/ucas?data=${encodeURIComponent(
              Buffer.from(JSON.stringify(qualifications)).toString('base64')
            )}`
          );
        }}
      >
        Share
      </button>
    </Layout>
  );
};

export default Ucas;
