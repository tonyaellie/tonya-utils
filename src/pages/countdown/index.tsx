import { useState } from 'react';

import { type NextPage } from 'next';
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';

const Countdown: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState({
    date: '',
    hideUi: false,
    fullScreen: false,
  });

  // TODO: make pretty

  return (
    <Layout title="Countdown" description="Counts down to a specified date.">
      <form
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          const parsedDate = new Date(data.date);
          if (isNaN(parsedDate.getTime())) {
            alert('Invalid date');
            return;
          }
          const params = new URLSearchParams();
          if (data.hideUi) {
            params.set('hideui', 'true');
          }
          if (data.fullScreen) {
            params.set('fullscreen', 'true');
          }
          router.push(`/countdown/${parsedDate.toISOString()}?${params}`);
        }}
      >
        <label htmlFor="date">Date</label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={data.date}
          onChange={(e) => setData({ ...data, date: e.target.value })}
        />
        <label htmlFor="hide-ui">Hide UI</label>
        <input
          type="checkbox"
          id="hide-ui"
          name="hide-ui"
          checked={data.hideUi}
          onChange={(e) => setData({ ...data, hideUi: e.target.checked })}
        />
        <label htmlFor="full-screen">Full Screen</label>
        <input
          type="checkbox"
          id="full-screen"
          name="full-screen"
          checked={data.fullScreen}
          onChange={(e) => setData({ ...data, fullScreen: e.target.checked })}
        />
        <input type="submit" value="Submit" />
      </form>
    </Layout>
  );
};

export default Countdown;
