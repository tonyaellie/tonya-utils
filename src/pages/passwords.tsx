import { useState } from 'react';

import { toast } from 'react-toastify';

import Layout from '../components/Layout';

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

  return (
    <Layout title="Passwords" description="Password generator">
      <button
        className="rounded border border-blue-400 p-2 hover:text-blue-600 "
        onClick={() => {
          const newPasswords: string[] = [];
          for (let i = 0; i < 10; i++) {
            newPasswords.push(generatePassword());
          }
          setPasswords(newPasswords);
        }}
      >
        Generate Passwords
      </button>
      <div className="py-2" />
      <div>
        {passwords.map((password, index) => (
          <div
            className="cursor-pointer hover:text-blue-600"
            key={index}
            onClick={async () => {
              await navigator.clipboard.writeText(password);
              toast.success('Copied to clipboard!');
            }}
          >
            {password}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Passwords;
