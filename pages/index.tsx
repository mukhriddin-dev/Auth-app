import Head from 'next/head';
import HomePage from './home';

import {AuthContextProvider} from '../store/auth-context';

export default function Home() {
  return (
    <div>
      <AuthContextProvider>
        <Head>
          <title>Awsome App</title>
          <meta name="description" content="Awesome App" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <HomePage />
      </AuthContextProvider>
    </div>
  );
}
