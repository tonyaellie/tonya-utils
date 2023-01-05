import { type NextPage } from 'next';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import Layout from '../components/Layout';

type Qualification = {
  name: string;
  value: number;
  id: string;
};

const allQualification = [
  { name: 'AS Level A', value: 20, id: 'as-level-a' },
  { name: 'AS Level B', value: 16, id: 'as-level-b' },
  { name: 'AS Level C', value: 12, id: 'as-level-c' },
  { name: 'AS Level D', value: 10, id: 'as-level-d' },
  { name: 'AS Level E', value: 6, id: 'as-level-e' },
  { name: 'A Level A*', value: 56, id: 'a-level-a-star' },
  { name: 'A Level A', value: 48, id: 'a-level-a' },
  { name: 'A Level B', value: 40, id: 'a-level-b' },
  { name: 'A Level C', value: 32, id: 'a-level-c' },
  { name: 'A Level D', value: 24, id: 'a-level-d' },
  { name: 'A Level E', value: 16, id: 'a-level-e' },
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

const Ucas: NextPage = () => {
  const [qualifications, setQualifications] = useState<Qualification[]>([
    { name: 'Choose a qualification', value: 0, id: 'choose' },
  ]);

  return (
    <Layout
      title="UCAS Calculator"
      description="Find the different in two bits of text."
    >
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
    </Layout>
  );
};

export default Ucas;
