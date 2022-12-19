import { type NextPage } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';

// TODO: make look good

type CustomLinkProps = {
  name: string;
};

const CustomLink: React.FC<CustomLinkProps> = ({ name }) => {
  return (
    <Link href={`/${name}`} className="capitalize underline hover:text-slate-300">
      {name}
    </Link>
  );
};

const Home: NextPage = () => {
  return (
    <Layout title="Home" description="Home my utils.">
      <h1>Some utils I use:</h1>
      <div className="flex flex-col">
        <CustomLink name="counter" />
        <CustomLink name="diff" />
        <CustomLink name="encoder" />
      </div>
    </Layout>
  );
};

export default Home;
