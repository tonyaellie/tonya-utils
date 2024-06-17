import { type NextPage } from 'next';

export const metadata = {
  title: 'Home',
  description: 'Home page.',
};

const Home: NextPage = () => {
  return (
    <>
      This website hosts a collection of utilities for various purposes. You can
      navigate between them either by clicking on the links in the navigation
      bar (which you can open with the button in the top left corner) or by
      using the keyboard shortcuts (e.g. pressing <kbd>crtl-k</kbd> to open the
      command search).
    </>
  );
};

export default Home;
