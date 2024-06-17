'use client';

import { useState } from 'react';

import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Teams = () => {
  const [members, setMembers] = useState<string[]>([]);
  const [numTeams, setNumTeams] = useState(1);
  const [teams, setTeams] = useState<string[][]>([]);

  return (
    <div className="flex flex-col gap-2">
      <AutosizeTextarea
        placeholder="Enter a list of names separated by newlines."
        value={members.join('\n')}
        onChange={(e) => setMembers(e.target.value.split('\n'))}
      />
      <Input
        value={numTeams}
        onChange={(e) => setNumTeams(parseInt(e.target.value))}
      />
      <Button
        onClick={() => {
          const randomlySortedMembers = members
            .filter((member) => member.length > 0)
            .sort(() => Math.random() - 0.5);
          const teams = Array.from({ length: numTeams }, () => [] as string[]);

          let i = 0;
          while (randomlySortedMembers.length > 0) {
            teams[i % numTeams]!.push(randomlySortedMembers.pop()!);
            i++;
          }

          setTeams(teams);
        }}
      >
        Generate
      </Button>
      {teams
        .map((team, index) => (
          <div key={index}>
            <div className="text-lg font-bold text-primary">
              Team {index + 1}
            </div>
            {team.map((member, index) => (
              <div key={index}>{member}</div>
            ))}
          </div>
        ))
        // put a separator between teams
        .reduce(
          (acc, curr) => [...acc, <Separator key={acc.length} />, curr],
          [] as JSX.Element[]
        )}
    </div>
  );
};

export default Teams;
