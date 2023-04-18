import { type NextPage } from 'next';
import Link from 'next/link';

export const metadata = {
  title: 'Home',
  description: 'Home my utils.',
};

// TODO: make look good

type CustomLinkProps = {
  name: string;
};

const CustomLink: React.FC<CustomLinkProps> = ({ name }) => {
  return (
    <Link
      href={`/${name.toLocaleLowerCase()}`}
      className="border-t border-primary-500 px-2 py-1 capitalize hover:bg-primary-500 hover:text-amethyst-1"
    >
      {name}
    </Link>
  );
};

const Home: NextPage = () => {
  return (
    <div className="flex w-48 flex-col rounded border border-primary-500">
      <span className="px-2 py-1 font-bold">Utils:</span>
      <CustomLink name="counter" />
      <CustomLink name="diff" />
      <CustomLink name="encoder" />
      <CustomLink name="TTTime" />
      <CustomLink name="UCAS" />
      <CustomLink name="countdown" />
      <CustomLink name="passwords" />
      <CustomLink name="unix" />
    </div>
  );
};

export default Home;
