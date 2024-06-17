'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

const getRandom = (arr: string) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const generatePassword = () => {
  // requirements:
  // 16 long
  // first 1 is a letter
  // 5 lowercase letters
  // 5 uppercase letters
  // 3 numbers
  // 2 special characters
  // no repeating characters
  // no similar characters (i, l, 1, o, 0, O)
  const letters = 'abcdefghjkmnpqrstuvwxyz';
  const numbers = '23456789';
  const specialCharacters = '!@#$%^&*_+~?-=';
  const password = [];
  // push 5 lowercase and 5 uppercase letters
  for (let i = 0; i < 5; i++) {
    password.push(getRandom(letters));
    password.push(getRandom(letters.toUpperCase()));
  }
  // push 3 numbers
  for (let i = 0; i < 3; i++) {
    password.push(getRandom(numbers));
  }
  // push 2 special characters
  for (let i = 0; i < 2; i++) {
    password.push(getRandom(specialCharacters));
  }
  // shuffle the array
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }
  // add the first letter
  password.unshift(getRandom(letters));
  // return the password
  return password.join('');
};

const Passwords = () => {
  const [passwords, setPasswords] = useState<string[]>([]);

  const generatePasswords = () => {
    const newPasswords: string[] = [];
    for (let i = 0; i < 10; i++) {
      newPasswords.push(generatePassword());
    }
    setPasswords(newPasswords);
  };

  useEffect(() => {
    generatePasswords();
  }, []);

  return (
    <div className="flex w-56 flex-col overflow-clip rounded border">
      <button
        className="py-2 hover:bg-destructive"
        onClick={() => {
          generatePasswords();
        }}
      >
        Generate New Passwords
      </button>
      {passwords.map((password, index) => (
        <button
          className="border-t py-2 hover:bg-primary"
          key={index}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(password);
              toast.success('Copied to clipboard!');
            } catch (error) {
              console.error(error);
              toast.error('Failed to copy to clipboard!');
            }
          }}
        >
          {password}
        </button>
      ))}
    </div>
  );
};

export default Passwords;
