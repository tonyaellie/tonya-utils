import { type NextPage } from 'next';

import Layout from '../../components/Layout';

const Countdown: NextPage = () => {
  return (
    <Layout title="Countdown" description="Counts down to a specified date.">
      <ul className="list-inside list-disc">
        <li>Allow for input of date and time</li>
        <li>Config flag for disabling ui Config</li>
        <li>flag for full screen</li>
      </ul>
    </Layout>
  );
};

export default Countdown;
